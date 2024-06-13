import os
import sys
from functools import partial
from rpy2 import robjects
from rpy2.robjects import conversion, default_converter
from prefect import task, get_run_logger
from prefect.context import FlowRunContext
from utils.types import PG_TENANT_USERS, dqdOptionsType
from utils.databaseConnectionUtils import getSetDBDriverEnvString, getDatabaseConnectorConnectionDetailsString
from flows.alp_dqd.hooks import persist_dqd


@task
def execute_dqd(
    schemaName: str,
    databaseCode: str,
    cdmVersionNumber: str,
    vocabSchemaName: str,
    releaseDate: str,
    cohortDefinitionId: str,
    outputFolder: str,
    checkNames: str,
    cohortDatabaseSchema: str,
    cohortTableName: str,
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
                    checkNames: {checkNames}
                    cohortDatabaseSchema: {cohortDatabaseSchema}
                    cohortTableName: {cohortTableName}
                '''
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
                cohortDatabaseSchema <- '{cohortDatabaseSchema}'
                cohortTableName <- '{cohortTableName}'

                # Set r_libs_user_directory to be the priority for packages to be loaded
                .libPaths('{r_libs_user_directory}')

                # Run executeDqChecks
                DataQualityDashboard::executeDqChecks(connectionDetails = connectionDetails,cdmDatabaseSchema = cdmDatabaseSchema,resultsDatabaseSchema = resultsDatabaseSchema,cdmSourceName = cdmSourceName,numThreads = numThreads,sqlOnly = sqlOnly,outputFolder = outputFolder,outputFile = outputFile,verboseMode = verboseMode,writeToTable = writeToTable,checkLevels = checkLevels,checkNames = checkNames,cdmVersion = cdmVersion, cohortDefinitionId = cohortDefinitionId, cohortDatabaseSchema = cohortDatabaseSchema, cohortTableName = cohortTableName)
        ''')


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

    if options.cohortDatabaseSchema:
        cohortDatabaseSchema = options.cohortDatabaseSchema
    else:
        cohortDatabaseSchema = schemaName

    if options.cohortTableName:
        cohortTableName = options.cohortTableName
    else:   
        cohortTableName = "cohort"

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
                   checkNames,
                   cohortDatabaseSchema,
                   cohortTableName)


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
