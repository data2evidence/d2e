import importlib
import os
import sys
import asyncio
import json
from rpy2 import robjects
from rpy2.robjects import conversion, default_converter
from prefect import task, get_run_logger
from utils.types import PG_TENANT_USERS, cohortSurvivalOptionsType
from utils.databaseConnectionUtils import (
    getSetDBDriverEnvString,
    getDatabaseConnectorConnectionDetailsString,
)
from api.AnalyticsSvcAPI import AnalyticsSvcAPI
from prefect.serializers import JSONSerializer
from prefect.filesystems import RemoteFileSystem as RFS


def execute_cohort_survival(options: cohortSurvivalOptionsType):
    logger = get_run_logger()
    logger.info("Running Cohort Survival")
    databaseCode = options.databaseCode
    schemaName = options.schemaName
    targetCohortDefinitionId = options.targetCohortDefinitionId
    outcomeCohortDefinitionId = options.outcomeCohortDefinitionId
    datasetId = options.datasetId

    generate_cohort_survival_data(
        databaseCode,
        schemaName,
        targetCohortDefinitionId,
        outcomeCohortDefinitionId
    )


@task(
    result_storage=RFS.load(
        os.getenv("DATAFLOW_MGMT__FLOWS__RESULTS_SB_NAME")),
    result_storage_key="{flow_run.id}_km.json",
    result_serializer=JSONSerializer(),
    persist_result=True,
)
def generate_cohort_survival_data(
    database_code: str,
    schema_name: str,
    target_cohort_definition_id: int,
    outcome_cohort_definition_id: int,
):
    filename = f"{database_code}_{schema_name}"
    r_libs_user_directory = os.getenv("R_LIBS_USER")

    # Get credentials for database code
    dbutils_module = importlib.import_module("alpconnection.dbutils")
    db_credentials = dbutils_module.extract_db_credentials(database_code)

    with conversion.localconverter(default_converter):
        result = robjects.r(
            f"""
# Function to generate a random string of specified length
.libPaths(c('{r_libs_user_directory}',.libPaths()))
library(CDMConnector)
library(CohortSurvival)
library(dplyr)
library(ggplot2)
library(rjson)
library(tools)
# Run R console inside the dataflow agent container to run these code


# VARIABLES
filename <- "{filename}"
target_cohort_definition_id <- {target_cohort_definition_id}
outcome_cohort_definition_id <- {outcome_cohort_definition_id}
pg_host <- "{db_credentials['host']}"
pg_port <- "{db_credentials['port']}"
pg_dbname <- "{db_credentials['databaseName']}"
pg_user <- "{db_credentials['user']}"
pg_password <- "{db_credentials['password']}"
pg_schema <- "{schema_name}"
# END VARIABLES
duckdb_dir <- Sys.getenv("DUCKDB__DATA_FOLDER")
filepath <- file.path(duckdb_dir, filename)

random_string <- function(n = 6) {{
    paste0(sample(c(0:9, letters, LETTERS), n, replace = TRUE), collapse = "")
}}
# Generate a random postfix and create a new filename
postfix <- random_string()
duplicate_filepath <- file.path(duckdb_dir, paste0(filename, "_", postfix))

# Copy the original file to the new file
file.copy(filepath, duplicate_filepath)
print(paste("Created duckdb File: ", duplicate_filepath))
con <- NULL
tryCatch(
    {{ duckdb_pg_con <- DBI::dbConnect(duckdb::duckdb(), dbdir = ":memory:")
        postgres_con_query <- sprintf("INSTALL postgres_scanner;LOAD postgres_scanner;CREATE TABLE duckdb_cohort AS FROM (SELECT * FROM postgres_scan('host=%s port=%s dbname=%s user=%s password=%s', '%s',  'cohort'))", pg_host, pg_port, pg_dbname, pg_user, pg_password, pg_schema)
        result <- DBI::dbExecute(duckdb_pg_con, postgres_con_query)
        target_cohort <- DBI::dbGetQuery(duckdb_pg_con, sprintf("SELECT * from duckdb_cohort WHERE cohort_definition_id = %d;", target_cohort_definition_id))
        outcome_cohort <- DBI::dbGetQuery(duckdb_pg_con, sprintf("SELECT * from duckdb_cohort WHERE cohort_definition_id = %d;", outcome_cohort_definition_id))

        duckdb_con <- DBI::dbConnect(duckdb::duckdb(dbdir = duplicate_filepath, read_only = FALSE))

        # Write the data frame to DuckDB as a table
        DBI::dbWriteTable(duckdb_con, "target_cohort", target_cohort)
        DBI::dbWriteTable(duckdb_con, "outcome_cohort", outcome_cohort)

        # Remove these when cohorts functionality are improved
        query <- "
            UPDATE outcome_cohort
            SET cohort_start_date = death_date, cohort_end_date = death.death_date
            FROM death
            WHERE outcome_cohort.subject_id = death.person_id
            AND death_date IS NOT NULL
        "
        DBI::dbExecute(duckdb_con, query)

        query <- "
            UPDATE target_cohort
            SET cohort_end_date = cohort_start_date
        "
        DBI::dbExecute(duckdb_con, query)

        # cdm_from_con is from CDMConnection
        # duckdb uses 'main' as default schema name
        cdm <- cdm_from_con(
            con = duckdb_con,
            write_schema = "main",
            cdm_schema = "main",
            cohort_tables = c("target_cohort", "outcome_cohort"),
            .soft_validation = TRUE
        )

        death_survival <- estimateSingleEventSurvival(cdm,
            targetCohortTable = "target_cohort",
            outcomeCohortTable = "outcome_cohort"
        )

        plot <- plotSurvival(death_survival)
        plot_data <- ggplot_build(plot)$data[[1]]
        # Convert data to a list if not already
        plot_data <- as.list(plot_data)

        # Add a key to the list
        plot_data[["status"]] <- "SUCCESS"
        plot_data_json <- toJSON(plot_data)

        print(plot_data_json)
        cdm_disconnect(cdm)
        return(plot_data_json) }},
    error = function(e) {{ print(e)
        data <- list(status = "ERROR", e$message)
        return(toJSON(data)) }},
    finally = {{ if (!is.null(con)) {{ DBI::dbDisconnect(con)
        print("Disconnected the database.") }}
    file.remove(duplicate_filepath)
    print("Removed temporary duckdb file") }}
)
"""
        )
        # Parsing the json from R and returning to prevent double serialization
        # of the string
        result_dict = json.loads(str(result[0]))
        return result_dict
