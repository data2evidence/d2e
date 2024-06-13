# Function to generate a random string of specified length
.libPaths(c("/home/docker/plugins/R/site-library", .libPaths()))
library(CDMConnector)
library(CohortSurvival)
library(dplyr)
library(ggplot2)
library(rjson)
library(tools)
# Run R console inside the dataflow agent container to run these code


# VARIABLES
filename <- "alpdev_pg_cdmdefault"
target_cohort_definition_id <- 3
outcome_cohort_definition_id <- 4
# END VARIABLES
duckdb_dir <- Sys.getenv("DUCKDB__DATA_FOLDER")
filepath <- file.path(duckdb_dir, filename)

random_string <- function(n = 6) {
    paste0(sample(c(0:9, letters, LETTERS), n, replace = TRUE), collapse = "")
}
# Generate a random postfix and create a new filename
postfix <- random_string()
duplicate_filepath <- file.path(duckdb_dir, paste0(filename, "_", postfix))

# Copy the original file to the new file
file.copy(filepath, duplicate_filepath)
print(paste("Created duckdb File: ", duplicate_filepath))
con <- NULL
tryCatch(
    {
        duckdb_pg_con <- DBI::dbConnect(duckdb::duckdb(), dbdir = ":memory:")
        postgres_con_query <- "INSTALL postgres_scanner;LOAD postgres_scanner;CREATE TABLE duckdb_cohort AS FROM (SELECT * FROM postgres_scan('host=alp-minerva-postgres-1 port=5432 dbname=alpdev_pg user=postgres_tenant_read_user password=Toor1234', 'cdmdefault',  'cohort'))"
        result <- DBI::dbExecute(duckdb_pg_con, postgres_con_query)
        target_cohort <- DBI::dbGetQuery(duckdb_pg_con, sprintf("SELECT * from duckdb_cohort WHERE cohort_definition_id = %d;", target_cohort_definition_id))
        outcome_cohort <- DBI::dbGetQuery(duckdb_pg_con, sprintf("SELECT * from duckdb_cohort WHERE cohort_definition_id = %d;", outcome_cohort_definition_id))

        duckdb_con <- DBI::dbConnect(duckdb::duckdb(dbdir = duplicate_filepath, read_only = FALSE))

        # Write the data frame to DuckDB as a table
        DBI::dbWriteTable(duckdb_con, "target_cohort", target_cohort)
        DBI::dbWriteTable(duckdb_con, "outcome_cohort", outcome_cohort)

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
        my_json <- toJSON(plot_data)
        print(my_json)
        # TODO: Send it to save
        cdm_disconnect(cdm)
    },
    error = function(e) {
        print(e)
    },
    finally = {
        if (!is.null(con)) {
            DBI::dbDisconnect(con)
            print("Disconnected the database.")
        }
        file.remove(duplicate_filepath)
        print("Removed temporary duckdb file")
    }
)
