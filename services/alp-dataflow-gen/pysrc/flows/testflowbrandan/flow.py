from prefect_shell import ShellOperation
from prefect import flow, task, get_run_logger
from dao.DBDao import DBDao
from utils.types import PG_TENANT_USERS
from flows.testflowbrandan.datamart import datamart_copy_schema
from flows.testflowbrandan.types import DATAMART_TYPES
from d2e_dbsvc import create_datamodel
from d2e_dbsvc.types import createDataModelType

snapshot_mock = {
    "timestamp": "2009-04-12 23:59:59",
    "patientsToBeCopied": [
        1, 2, 3, 16, 26, 65
    ]
}


def testflowbrandan(options):
    logger = get_run_logger()
    req = {
        "params": {
            # "schema": "cdm_pgcdmdefaultcopy_f64d1f1732ba447683b45b66aab4edfb",
            "schema": "cdm_pgcdmdefault_copy",
            "dataModel": "omop5-4",
            "tenant": "alpdev_pg",
        },
        "query": {
            "sourceSchema": "cdmdefault"
        },
        "body": {
            "snapshotCopyConfig": snapshot_mock,
            "customChangelogFilepath": "",
            "customClasspath": ""
        }
    }
    targetSchema = req['params']['schema']
    dataModel = req['params']['dataModel']
    tenant = req['params']['tenant']
    sourceSchema = req['query']['sourceSchema']
    snapshotCopyConfig = req['body']['snapshotCopyConfig']
    pluginChangelogFilepath = req['body']['customChangelogFilepath']
    pluginClasspath = req['body']['customClasspath']

    datamart_type = DATAMART_TYPES.COPY_TO_DB

    # tenantConfig = this.tenantConfigs[tenant]
    # get db connection
    db_dao = DBDao(tenant, sourceSchema, PG_TENANT_USERS.ADMIN_USER)

    # check if schema exist
    schema_exists = db_dao.check_schema_exists()
    if not schema_exists:
        error_message = "Create snapshot failure. Source schema not found."
        logger.error(error_message)
        httpResponse = {
            "message": error_message,
            "successfulSchemas": [],
            "failedSchemas": [sourceSchema],
            "errorOccurred": True,
        }
        raise Exception(httpResponse)

    # create cdm schema
    if datamart_type == DATAMART_TYPES.COPY_TO_DB:
        create_datamodel(
            createDataModelType(
                database_code=tenant,
                data_model=dataModel,
                schema_name=targetSchema,
                cleansed_schema_option=False,
                dialect="postgres",
                flow_name="flows/testflowbrandan/",
                changelog_filepath="liquibase-changelog-5-4.xml",
                vocab_schema="cdmvocab")
        )

    # datamart_copy_schema
    try:
        _, failed_tables = datamart_copy_schema(
            db_dao,
            sourceSchema,
            targetSchema,
            snapshotCopyConfig,
            datamart_type
        )
        if len(failed_tables) > 0:
            raise Exception(
                f"The following tables has failed datamart creation: {failed_tables}")
    except Exception as err:
        logger.error(err)
        httpResponse = {
            "message": "Schema creation successful, but failed to load data!",
            "successfulSchemas": [],
            "failedSchemas": [targetSchema],
            "errorOccurred": True,
        }
        raise Exception(httpResponse)
    else:
        httpResponse = {
            "message": "Schema snapshot successfully created!",
            "successfulSchemas": [targetSchema],
            "failedSchemas": [],
            "errorOccurred": False,
        }
        logger.info(f"New {targetSchema} schema created & loaded successfully", {
            "schema": targetSchema,
            "op": f"""{targetSchema} schema created and loaded with configuration {snapshotCopyConfig}"""
        })
        return httpResponse
