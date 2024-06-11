# Function to generate a random string of specified length
.libPaths(c("/home/docker/plugins/R/site-library", .libPaths()))
library(CDMConnector)
library(CohortSurvival)
library(dplyr)
library(ggplot2)
library(rjson)
library(tools)
# Run R console inside the dataflow agent container to run these code

filename <- "alpdev_pg_cdmdefault"
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
        con <- DBI::dbConnect(duckdb::duckdb(dbdir = new_filepath, read_only = FALSE))

        exposure_cohort <- data.frame(
            subject_id = c(1, 2, 3, 3, 4, 5),
            cohort_definition_id = c(1, 1, 1, 2, 2, 2),
            cohort_start_date = c(
                as.Date("2020-01-01"),
                as.Date("2020-02-03"),
                as.Date("2020-05-01"),
                as.Date("2020-05-01"),
                as.Date("2020-08-01"),
                as.Date("2020-09-01")
            ),
            cohort_end_date = c(
                as.Date("2020-01-31"),
                as.Date("2022-02-03"),
                as.Date("2021-06-28"),
                as.Date("2021-06-01"),
                as.Date("2021-08-01"),
                as.Date("2021-09-01")
            )
        )

        outcome_cohort <- dplyr::tibble(
            cohort_definition_id = c(2, 3, 3),
            subject_id = c(2, 3, 4),
            cohort_start_date = c(
                as.Date("2021-01-01"),
                as.Date("2021-01-01"),
                as.Date("2021-01-01")
            ),
            cohort_end_date = c(
                as.Date("2021-01-01"),
                as.Date("2021-01-01"),
                as.Date("2021-01-01")
            )
        )

        observation_period <- dplyr::tibble(
            observation_period_id = c(1, 2, 3, 4, 5, 6, 7),
            person_id = c(1, 2, 3, 4, 5, 6, 7),
            observation_period_start_date = c(
                rep(as.Date("1980-07-20"), 7)
            ),
            observation_period_end_date = c(
                rep(as.Date("2023-05-20"), 7)
            ),
            period_type_concept_id = c(rep(0, 7))
        )

        person <- dplyr::tibble(
            person_id = c(1, 2, 3, 4, 5),
            year_of_birth = c(rep("1990", 5)),
            month_of_birth = c(rep("02", 5)),
            day_of_birth = c(rep("11", 5)),
            gender_concept_id = c(rep(0, 5)),
            ethnicity_concept_id = c(rep(0, 5)),
            race_concept_id = c(rep(0, 5))
        )

        # Write the data frame to DuckDB as a table
        DBI::dbWriteTable(con, "exposure_cohort", exposure_cohort)
        DBI::dbWriteTable(con, "outcome_cohort", outcome_cohort)

        # These should be untouched from db i.e. overwrite = FALSE
        DBI::dbWriteTable(con, "observation_period", observation_period, overwrite = TRUE)
        DBI::dbWriteTable(con, "person", person, overwrite = TRUE)

        # cdm_from_con is from CDMConnection
        cdm <- cdm_from_con(
            con = con,
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
