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
exposure_cohort_definition_id <- 3
outcome_cohort_definition_id <- 4
# END VARIABLES
duckdb_dir <- Sys.getenv("DUCKDB__DATA_FOLDER")
filepath <- file.path(duckdb_dir, filename)

random_string <- function(n = 6) {
    paste0(sample(c(0:9, letters, LETTERS), n, replace = TRUE), collapse = "")
}
# Generate a random postfix and create a new filename
postfix <- random_string()
new_filename <- paste0(filename, "_", postfix)
new_filepath <- file.path(duckdb_dir, new_filename)

# Copy the original file to the new file
file.copy(filepath, new_filepath)
con <- NULL
tryCatch(
    {
        duckdb_con <- DBI::dbConnect(duckdb::duckdb(), dbdir = ":memory:")
        postgres_con_query <- "INSTALL postgres_scanner;LOAD postgres_scanner;CREATE TABLE jtable AS FROM (SELECT * FROM postgres_scan('host=alp-minerva-postgres-1 port=5432 dbname=alpdev_pg user=postgres_tenant_read_user password=Toor1234', 'cdmdefault',  'cohort'))"
        result <- DBI::dbExecute(duckdb_con, postgres_con_query)
        exposure_cohort <- DBI::dbGetQuery(duckdb_con, sprintf("SELECT * from jtable WHERE cohort_definition_id = %d;", exposure_cohort_definition_id))
        outcome_cohort <- DBI::dbGetQuery(duckdb_con, sprintf("SELECT * from jtable WHERE cohort_definition_id = %d;", outcome_cohort_definition_id))

        duckdb_con <- DBI::dbConnect(duckdb::duckdb(dbdir = new_filepath, read_only = FALSE))

        # Write the data frame to DuckDB as a table
        DBI::dbWriteTable(duckdb_con, "exposure_cohort", exposure_cohort)
        DBI::dbWriteTable(duckdb_con, "outcome_cohort", outcome_cohort)

        # These should be untouched from db i.e. overwrite = FALSE
        # DBI::dbWriteTable(duckdb_con, "observation_period", observation_period, overwrite = TRUE)
        # DBI::dbWriteTable(duckdb_con, "person", person, overwrite = TRUE)

        # cdm_from_con is from CDMConnection
        cdm <- cdm_from_con(
            con = duckdb_con,
            cdm_schema = "main",
            write_schema = "main",
            cdm_name = "alpdev_pg_cdmdefault",
            cohort_tables = c("exposure_cohort", "outcome_cohort"),
            .soft_validation = TRUE
        )

        death_survival <- estimateSingleEventSurvival(cdm,
            targetCohortTable = "exposure_cohort",
            outcomeCohortTable = "outcome_cohort"
        )
        death_survival |>
            glimpse()

        plot <- plotSurvival(death_survival)
        plot_data <- ggplot_build(plot)$data[[1]]
        my_json <- toJSON(plot_data)
        print(my_json)
        # TODO: Send it to save
        print(paste("Created duckdb File: ", new_filepath))
    },
    error = function(e) {
        print(e)
    },
    finally = {
        if (!is.null(con)) {
            DBI::dbDisconnect(con)
            print("Disconnected the database.")
        }
        file.remove(new_filepath)
        print("Removed temporary duckdb file")
    }
)
