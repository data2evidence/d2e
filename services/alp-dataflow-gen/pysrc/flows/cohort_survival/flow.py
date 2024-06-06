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
    setDBDriverEnvString = getSetDBDriverEnvString()
    connectionDetailsString = getDatabaseConnectorConnectionDetailsString(
        databaseCode, None, PG_TENANT_USERS.ADMIN_USER)
    r_libs_user_directory = os.getenv("R_LIBS_USER")
    with conversion.localconverter(default_converter):
        robjects.r(f'''
                .libPaths(c('{r_libs_user_directory}',.libPaths()))
                library('CohortSurvival', lib.loc = '{r_libs_user_directory}')
                {setDBDriverEnvString}
                {connectionDetailsString}
                test <- 'test'
                
                cat("Generating cohort survival chart data")
                )
        ''')
