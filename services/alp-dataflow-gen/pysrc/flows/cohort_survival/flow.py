import os
import sys
import asyncio
import json
from rpy2 import robjects
from rpy2.robjects import conversion, default_converter
from prefect import task, get_run_logger
from utils.types import PG_TENANT_USERS, cohortSurvivalOptionsType
from utils.databaseConnectionUtils import getSetDBDriverEnvString, getDatabaseConnectorConnectionDetailsString
from api.AnalyticsSvcAPI import AnalyticsSvcAPI


def execute_cohort_survival(
    options: cohortSurvivalOptionsType
):
    logger = get_run_logger()
    logger.info('Running Cohort Survival')
    databaseCode = options.databaseCode

    generate_cohort_survival_data(databaseCode)


@task
def generate_cohort_survival_data(databaseCode: str):
    r_libs_user_directory = os.getenv("R_LIBS_USER")
    with conversion.localconverter(default_converter):
        robjects.r(f'''
                .libPaths(c('{r_libs_user_directory}',.libPaths()))
                library(CDMConnector)
                library(CohortSurvival)
                library(dplyr)
                library(ggplot2)
                library(rjson)
                
                filename <- "alpdev_pg_cdmdefault"
                dbdir <- Sys.getenv("DUCKDB__DATA_FOLDER")
                dbdir <- file.path(dbdir, filename)
                con <- DBI::dbConnect(duckdb::duckdb(dbdir = dbdir))
                cdm <- cdm_from_con(con = con, 
                    cdm_schema = "main", 
                    write_schema = "main", 
                    cdm_name = "alpdev_pg_cdmdefault")
                death_survival <- estimateSingleEventSurvival(cdm,
                    targetCohortTable = "mgus_diagnosis",
                    outcomeCohortTable = "death_cohort"
                )
                
                cat("Generating cohort survival chart data")
                )
        ''')


    # copy tables from postgres into duckdb
    for table in table_names:
        try:
            logger.info(f"Copying table: {table} from postgres into duckdb...")
            with duckdb.connect(f"{os.getenv('DUCKDB__DATA_FOLDER')}/{duckdb_database_name}") as con:
                result = con.execute(
                    f"""CREATE TABLE {duckdb_database_name}.{table} AS FROM (SELECT * FROM postgres_scan('host={db_credentials['host']} port={db_credentials['port']} dbname={
                        db_credentials['databaseName']} user={db_credentials['user']} password={db_credentials['password']}', '{schema_name}', '{table}'))"""
                ).fetchone()
                logger.info(f"{result[0]} rows copied")
        except Exception as err:
            logger.error(f"Table:{table} loading failed with error: {err}f")
            raise (err)
    logger.info("Postgres tables succesfully copied into duckdb database file")