import importlib
import os
import json
from rpy2 import robjects
from rpy2.robjects import conversion, default_converter
from prefect import task, get_run_logger
from utils.types import cohortSurvivalOptionsType
from prefect.serializers import JSONSerializer
from prefect.filesystems import RemoteFileSystem as RFS


def execute_cohort_survival(options: cohortSurvivalOptionsType):
    logger = get_run_logger()
    logger.info("Running Cohort Survival")
    databaseCode = options.databaseCode
    schemaName = options.schemaName
    targetCohortDefinitionId = options.targetCohortDefinitionId
    outcomeCohortDefinitionId = options.outcomeCohortDefinitionId

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
library(RPostgres)
# Run R console inside the dataflow agent container to run these code


# VARIABLES
target_cohort_definition_id <- {target_cohort_definition_id}
outcome_cohort_definition_id <- {outcome_cohort_definition_id}
pg_host <- "{db_credentials['host']}"
pg_port <- "{db_credentials['port']}"
pg_dbname <- "{db_credentials['databaseName']}"
pg_user <- "{db_credentials['adminUser']}"
pg_password <- "{db_credentials['adminPassword']}"
pg_schema <- "{schema_name}"

con <- NULL
tryCatch(
    {{ 
        pg_con <- DBI::dbConnect(RPostgres::Postgres(),
            dbname = pg_dbname,
            host = pg_host,
            user = pg_user,
            password = pg_password,
            options=sprintf("-c search_path=%s", pg_schema))

        # Begin transaction to run below 2 queries as is required for cohort survival but are not needed to be commited to database
        DBI::dbBegin(pg_con)
        # Remove these when cohorts functionality are improved
        query <- sprintf("
            UPDATE cohort
            SET cohort_start_date = death_date, cohort_end_date = death.death_date
            FROM death
            WHERE subject_id = death.person_id
            AND death_date IS NOT NULL
            AND COHORT_DEFINITION_ID=%d", outcome_cohort_definition_id)
        DBI::dbExecute(pg_con, query)

        query <- sprintf("
            UPDATE cohort
            SET cohort_end_date = cohort_start_date
            WHERE COHORT_DEFINITION_ID=%d", target_cohort_definition_id)
            
        DBI::dbExecute(pg_con, query)

        # cdm_from_con is from CDMConnection
        cdm <- CDMConnector::cdm_from_con(
            con = pg_con,
            write_schema = pg_schema,
            cdm_schema = pg_schema,
            cohort_tables = c("cohort"),
            .soft_validation = TRUE
        )

        death_survival <- estimateSingleEventSurvival(cdm,
            targetCohortId = target_cohort_definition_id,
            outcomeCohortId = outcome_cohort_definition_id,
            targetCohortTable = "cohort",
            outcomeCohortTable = "cohort",
            estimateGap = 30
        )
        
        # Rollback queries done above after cohort survival is done
        DBI::dbRollback(pg_con)

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
    }}
)
"""
        )
        # Parsing the json from R and returning to prevent double serialization
        # of the string
        result_dict = json.loads(str(result[0]))
        return result_dict
