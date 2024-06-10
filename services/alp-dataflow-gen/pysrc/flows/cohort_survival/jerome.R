.libPaths(c("/home/docker/plugins/R/site-library", .libPaths()))
library(CDMConnector)
library(CohortSurvival)
library(dplyr)
library(ggplot2)
library(rjson)
library(tools)

filename <- "alpdev_pg_cdmdefault"
duckdb_dir <- Sys.getenv("DUCKDB__DATA_FOLDER")
filepath <- file.path(duckdb_dir, filename)

# Function to generate a random string of specified length
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
        con <- DBI::dbConnect(duckdb::duckdb(dbdir = new_filepath, read_only = FALSE))

        # cdm_from_con is from CDMConnection
        cdm <- cdm_from_con(
            con = con,
            cdm_schema = "main",
            write_schema = "main",
            cdm_name = "alpdev_pg_cdmdefault"
        )

        cdm_death <- generateDeathCohortSet(cdm = cdm, name = "death_cohort")

        # death_survival <- estimateSingleEventSurvival(cdm,
        #     targetCohortTable = "mgus_diagnosis",
        #     outcomeCohortTable = "death_cohort"
        # )
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
