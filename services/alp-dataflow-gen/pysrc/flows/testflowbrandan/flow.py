from prefect_shell import ShellOperation
from prefect import flow, task, get_run_logger
from utils.types import dqdOptionsType
from dao.DBDao import DBDao
from utils.types import PG_TENANT_USERS
from flows.testflowbrandan.datamart import saveSnapshotToDb

snapshot_mock = {
    "timestamp": "2009-04-12 23:59:59",
    "tableConfig": [
        {
            "tableName": "person",
            "columnsToBeCopied": [
                "month_of_birth",
                "day_of_birth",
                "birth_datetime",
                "location_id",
                "provider_id",
                "care_site_id",
                "person_source_value",
                "gender_source_value",
                "gender_source_concept_id",
                "race_source_value",
                "race_source_concept_id",
                "ethnicity_source_value",
                "ethnicity_source_concept_id",
                "person_id",
                "gender_concept_id",
                "year_of_birth",
                "race_concept_id",
                "ethnicity_concept_id"
            ]
        },
        {
            "tableName": "death",
            "columnsToBeCopied": [
                "death_datetime",
                "death_type_concept_id",
                "cause_concept_id",
                "cause_source_value",
                "cause_source_concept_id",
                "person_id",
                "death_date"
            ]
        },
    ],
    "patientsToBeCopied": [
        1, 2, 3, 16, 26, 65
    ]
}


def testflowbrandan(options: dqdOptionsType):
    req = {
        "params": {
            "schema": "cdm_pgcdmdefaultcopy_f64d1f1732ba447683b45b66aab4edfb",
            "dataModel": "OMOP5.4",
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

    # tenantConfig = this.tenantConfigs[tenant]
    # get db connection
    db = DBDao(tenant, sourceSchema, PG_TENANT_USERS.ADMIN_USER)

    # check if schema exist

    # create cdm schema

    try:
        # saveSnapshotToDb
        saveSnapshotToDb(db, sourceSchema, targetSchema, snapshotCopyConfig)
        httpResponse = {
            "message": "Schema snapshot successfully created!",
            "successfulSchemas": [targetSchema],
            "failedSchemas": [],
            "errorOccurred": False,
        }
        get_run_logger().info(f"New {targetSchema} schema created & loaded successfully", {
            "schema": targetSchema,
            "op": f"""{targetSchema} schema created and loaded with configuration {snapshotCopyConfig}"""
        })
        return httpResponse
    except Exception as err:
        get_run_logger().error(err)
        httpResponse = {
            "message": "Schema creation successful, but failed to load data!",
            "successfulSchemas": [],
            "failedSchemas": [targetSchema],
            "errorOccurred": True,
        }
        return httpResponse
