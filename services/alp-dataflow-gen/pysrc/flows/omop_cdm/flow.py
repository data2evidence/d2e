from rpy2 import robjects
from rpy2.robjects import conversion, default_converter
from prefect import task, get_run_logger
from utils.types import PG_TENANT_USERS, omopCDMOptionsType
from utils.databaseConnectionUtils import getDatabaseConnectorConnectionDetailsString
from dao.DBDao import DBDao
from alpconnection.dbutils import *
import os


def create_omop_cdm(options: omopCDMOptionsType):
    logger = get_run_logger()

    databaseCode = options.databaseCode
    schema_name = options.schemaName
    cdm_version = options.cdmVersion

    omop_cdm_dao = DBDao(databaseCode, schema_name, PG_TENANT_USERS.ADMIN_USER)

    schema_exists = check_schema_exists(omop_cdm_dao)
    if schema_exists:
        schema_empty = check_empty_schema(omop_cdm_dao)
    else:
        create_schema(omop_cdm_dao)
        schema_exists = True
        schema_empty = True

    if schema_exists & schema_empty:
        create_cdm_tables(databaseCode, schema_name, cdm_version)
    else:
        get_run_logger().error(
            f"Schema {schema_name} already exists in database with code:{databaseCode} and is not empty!")


@task
def check_empty_schema(omop_cdm_dao):
    # currently only supports pg dialect
    return omop_cdm_dao.check_empty_schema()


@task
def check_schema_exists(omop_cdm_dao):
    # currently only supports pg dialect
    return omop_cdm_dao.check_schema_exists()


@task
def create_schema(omop_cdm_dao):
    # currently only supports pg dialect
    return omop_cdm_dao.create_schema()


@task
def create_cdm_tables(databaseCode, schema_name, cdm_version):
    # currently only supports pg dialect
    r_libs_user_directory = os.getenv("R_LIBS_USER")
    connectionDetailsString = getDatabaseConnectorConnectionDetailsString(
        databaseCode,
        None,
        PG_TENANT_USERS.ADMIN_USER
    )
    with conversion.localconverter(default_converter):
        robjects.r(f'''
            .libPaths(c('{r_libs_user_directory}',.libPaths()))
            library('CommonDataModel', lib.loc = '{r_libs_user_directory}')
            {connectionDetailsString}
            cdm_version <- "{cdm_version}"
            schema_name <- "{schema_name}"
            CommonDataModel::executeDdl(connectionDetails = connectionDetails, cdmVersion = cdm_version, cdmDatabaseSchema = schema_name)
        '''
                   )
