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
target_cohort_definition_id <- 7
outcome_cohort_definition_id <- 3
competing_outcome_cohort_definition_id <- 4
pg_host <- "alp-minerva-postgres-1"
pg_port <- "5432"
pg_dbname <- "alpdev_pg"
pg_user <- "postgres_tenant_read_user"
pg_password <- "Toor1234"
pg_schema <- "cdmdefault"
# END VARIABLES
duckdb_dir <- Sys.getenv("DUCKDB__DATA_FOLDER")
filepath <- file.path(duckdb_dir, filename)

random_string <- function(n = 6) {{ paste0(sample(c(0:9, letters, LETTERS), n, replace = TRUE), collapse = "") }
}
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
        competing_outcome_cohort <- DBI::dbGetQuery(duckdb_pg_con, sprintf("SELECT * from duckdb_cohort WHERE cohort_definition_id = %d;", competing_outcome_cohort_definition_id))

        duckdb_con <- DBI::dbConnect(duckdb::duckdb(dbdir = duplicate_filepath, read_only = FALSE))

        # Write the data frame to DuckDB as a table
        DBI::dbWriteTable(duckdb_con, "target_cohort", target_cohort)
        DBI::dbWriteTable(duckdb_con, "outcome_cohort", outcome_cohort)
        DBI::dbWriteTable(duckdb_con, "competing_outcome_cohort", competing_outcome_cohort)

        # cdm_from_con is from CDMConnection
        # duckdb uses 'main' as default schema name
        cdm <- cdm_from_con(
            con = duckdb_con,
            write_schema = "main",
            cdm_schema = "main",
            cohort_tables = c("target_cohort", "outcome_cohort", "competing_outcome_cohort"),
            .soft_validation = TRUE
        )

        # death_survival <- estimateSingleEventSurvival(cdm,
        #     targetCohortTable = "target_cohort",
        #     outcomeCohortTable = "outcome_cohort"
        # )


        # plot <- plotSurvival(death_survival)
        # plot_data <- ggplot_build(plot)$data[[1]]
        # plot_data$status <- "SUCCESS"
        # plot_data_json <- toJSON(plot_data)

        # print(plot_data_json)


        competing_risk_survival <- estimateCompetingRiskSurvival(cdm,
            targetCohortTable = "target_cohort",
            outcomeCohortTable = "outcome_cohort",
            competingOutcomeCohortTable = "competing_outcome_cohort"
        )

        competing_plot <- plotSurvival(competing_risk_survival)
        competing_plot_data <- ggplot_build(competing_plot)$data[[1]]
        competing_plot_data$status <- "SUCCESS"
        competing_plot_data_json <- toJSON(competing_plot_data)
        print(competing_plot_data_json)

        cdm_disconnect(cdm)
        return(competing_plot_data_json) }},
    error = function(e) {{ print(e)
        data <- list(status = "ERROR", e$message)
        return(toJSON(data)) }},
    finally = {{ if (!is.null(con)) {{ DBI::dbDisconnect(con)
        print("Disconnected the database.") }}
    file.remove(duplicate_filepath)
    print("Removed temporary duckdb file") }}
)



# estimateSurvival(
#     cdm = cdm,
#     targetCohortTable = "target_cohort",
#     outcomeCohortTable = "outcome_cohort",
#     competingOutcomeCohortTable = "competing_outcome_cohort"
# )
