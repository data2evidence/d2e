import os
from utils.types import HANA_TENANT_USERS, PG_TENANT_USERS
from dao.DqdResultDao import DqdResultDao
from prefect import get_run_logger
from prefect.context import TaskRunContext
from alpconnection.dbutils import extract_db_credentials

# TODO make this run only once instead of setting everytime a job is ran


def getSetDBDriverEnvString():
    databaseConnectorJarFolder = '/app/inst/drivers'
    setjarFilePath = f"Sys.setenv(\'DATABASECONNECTOR_JAR_FOLDER\' = '{databaseConnectorJarFolder}')"
    return setjarFilePath


def getDatabaseConnectorConnectionDetailsString(databaseCode: str, releaseDate: str, userType: str):
    db_credentials = extract_db_credentials(databaseCode)

    match userType:
        case HANA_TENANT_USERS.READ_USER:
            databaseUser = db_credentials["readUser"]
            databasePassword = db_credentials["readPassword"]
        case HANA_TENANT_USERS.ADMIN_USER:
            databaseUser = db_credentials["adminUser"]
            databasePassword = db_credentials["adminPassword"]
        case PG_TENANT_USERS.ADMIN_USER:
            databaseUser = db_credentials["adminUser"]
            databasePassword = db_credentials["adminPassword"]
        case PG_TENANT_USERS.READ_USER:
            databaseUser = db_credentials["readUser"]
            databasePassword = db_credentials["readPassword"]

    databaseName = db_credentials["databaseName"]
    databaseHost = db_credentials["host"]
    databasePort = db_credentials["port"]
    databaseDialect = db_credentials["dialect"]

    if databaseDialect == "hana":
        databaseConnectionStr = f"jdbc:sap://{databaseHost}:{databasePort}?databaseName={databaseName}"
        # Append sessionVariable to databaseConnectionStr if releaseDate is defined
        if releaseDate:
            databaseConnectionStr += f"&sessionVariable:TEMPORAL_SYSTEM_TIME_AS_OF={releaseDate}"
    elif databaseDialect == "postgres":
        # OHDSI DatabaseConnector uses this postgres dialect naming
        databaseDialect = "postgresql"
        databaseConnectionStr = f"jdbc:{databaseDialect}://{databaseHost}:{databasePort}/{databaseName}"

    connectionDetailsString = f"connectionDetails <- DatabaseConnector::createConnectionDetails(dbms = '{databaseDialect}', connectionString = '{databaseConnectionStr}', user = '{databaseUser}', password = '{databasePassword}', pathToDriver = '/app/inst/drivers')"
    return connectionDetailsString


async def insert_to_dqd_result_table(flow_run_id: str, result: dict, error: bool, error_message: str):
    logger = get_run_logger()
    task_run_context = TaskRunContext.get().task_run.dict()
    task_run_name = str(task_run_context.get("name"))
    try:
        dqd_result_dao = DqdResultDao()
        dqd_result_dao.insert(flow_run_id=flow_run_id, result=result,
                              error=error, error_message=error_message)
        logger.info(
            f"Successfully persisted results for task run '{task_run_name}'")
    except Exception as e:
        logger.error(
            f"Failed to persist results for task run '{task_run_name}': {e}")
        raise e
