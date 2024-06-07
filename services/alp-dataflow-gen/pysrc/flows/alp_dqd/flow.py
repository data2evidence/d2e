import os
import json
import sys
from functools import partial
from rpy2 import robjects
from rpy2.robjects import conversion, default_converter
from prefect import task, get_run_logger
from prefect.context import FlowRunContext
from prefect.filesystems import S3
from prefect.serializers import JSONSerializer
from utils.types import PG_TENANT_USERS, dqdOptionsType
from utils.databaseConnectionUtils import getSetDBDriverEnvString, getDatabaseConnectorConnectionDetailsString
from flows.alp_dqd.hooks import persist_dqd


@task(result_storage=S3(bucket_path="dataflow-results/dqd"), 
      result_storage_key="{flow_run.id}_dqd.json",
      result_serializer=JSONSerializer())
def execute_dqd(
    schemaName: str,
    databaseCode: str,
    cdmVersionNumber: str,
    vocabSchemaName: str,
    releaseDate: str,
    cohortDefinitionId: str,
    outputFolder: str,
    checkNames: str,
):
    logger = get_run_logger()

    threads = os.getenv('DQD_THREAD_COUNT')
    r_libs_user_directory = os.getenv("R_LIBS_USER")

    setDBDriverEnvString = getSetDBDriverEnvString()
    connectionDetailsString = getDatabaseConnectorConnectionDetailsString(
        databaseCode, releaseDate, PG_TENANT_USERS.READ_USER)
    logger.info(f'''Running DQD with input parameters:
                    schemaName: {schemaName},
                    databaseCode: {databaseCode},
                    cdmVersionNumber: {cdmVersionNumber},
                    vocabSchemaName: {vocabSchemaName},
                    releaseDate: {releaseDate},
                    cohortDefinitionId: {cohortDefinitionId},
                    outputFolder: {outputFolder},
                    checkNames: {checkNames}'''
                )

    # raise Exception("test stop")
    with conversion.localconverter(default_converter):
        robjects.r(f'''
                {setDBDriverEnvString}
                {connectionDetailsString}
                cdmDatabaseSchema <- '{schemaName}'
                vocabDatabaseSchema <- '${vocabSchemaName}'
                resultsDatabaseSchema <- '{schemaName}'
                cdmSourceName <- '{schemaName}'
                numThreads <- {threads}
                sqlOnly <- FALSE
                outputFolder <- '{outputFolder}'
                outputFile <- '{schemaName}.json'
                writeToTable <- FALSE
                verboseMode <- TRUE
                checkLevels <- c('TABLE','FIELD','CONCEPT')
                checkNames <- {checkNames}
                cohortDefinitionId <- {cohortDefinitionId}
                cdmVersion <- '{cdmVersionNumber}'

                # Set r_libs_user_directory to be the priority for packages to be loaded
                .libPaths('{r_libs_user_directory}')

                # Run executeDqChecks
                DataQualityDashboard::executeDqChecks(connectionDetails = connectionDetails,cdmDatabaseSchema = cdmDatabaseSchema,resultsDatabaseSchema = resultsDatabaseSchema,cdmSourceName = cdmSourceName,numThreads = numThreads,sqlOnly = sqlOnly,outputFolder = outputFolder,outputFile = outputFile,verboseMode = verboseMode,writeToTable = writeToTable,checkLevels = checkLevels,checkNames = checkNames,cdmVersion = cdmVersion, cohortDefinitionId = cohortDefinitionId)
        ''')
    with open(f'{outputFolder}/{schemaName}.json', 'rt') as f:
            return json.loads(f.read())


def execute_dqd_flow(options: dqdOptionsType):
    schemaName = options.schemaName
    databaseCode = options.databaseCode
    cdmVersionNumber = options.cdmVersionNumber
    vocabSchemaName = options.vocabSchemaName
    releaseDate = options.releaseDate

    if options.cohortDefinitionId:
        cohortDefinitionId = f"c({options.cohortDefinitionId})"
    else:
        cohortDefinitionId = "c()"

    if options.checkNames:
        # Wrap each value in checkNames in single quotes
        checkNames = [
            f"'{checkName}'" for checkName in options.checkNames]
        # convert to comma separated string
        checkNames = f"c({','.join(checkNames)})"
    else:
        checkNames = "c()"

    flow_run_context = FlowRunContext.get().flow_run.dict()
    flow_run_id = str(flow_run_context.get("id"))
    outputFolder = f'/output/{flow_run_id}'
    execute_dqd_wo = execute_dqd.with_options(
        on_failure=[partial(
            persist_dqd, **dict(output_folder=outputFolder, schema_name=schemaName))],
        on_completion=[partial(
            persist_dqd, **dict(output_folder=outputFolder, schema_name=schemaName))]
    )
    execute_dqd_wo(schemaName,
                   databaseCode,
                   cdmVersionNumber,
                   vocabSchemaName,
                   releaseDate,
                   cohortDefinitionId,
                   outputFolder,
                   checkNames)


if __name__ == "__main__":
    try:
        execute_dqd({
            "schemaName": "schemaName",
            "cdmVersionNumber": '5.4',
            "threads": 1
        })
        sys.exit(0)
    except Exception as e:
        print(e)
