import os
import sys
from functools import partial
from rpy2 import robjects
from rpy2.robjects import conversion, default_converter
from prefect import task, get_run_logger
from prefect.context import FlowRunContext
from utils.types import PG_TENANT_USERS
from utils.databaseConnectionUtils import getSetDBDriverEnvString, getDatabaseConnectorConnectionDetailsString
from flows.alp_data_characterization.hooks import persist_data_characterization, persist_export_to_ares
from utils.types import dcOptionsType
from alpconnection.dbutils import get_db_svc_endpoint_dialect
import importlib
from flows.alp_db_svc.flow import _run_db_svc_shell_command, _add_plugin_options

r_libs_user_directory = os.getenv("R_LIBS_USER")


@task
async def execute_data_characterization(schemaName: str,
                                        databaseCode: str,
                                        cdmVersionNumber: str,
                                        vocabSchemaName: str,
                                        releaseDate: str,
                                        resultsSchema: str,
                                        excludeAnalysisIds: str,
                                        outputFolder: str):
    try:
        logger = get_run_logger()
        threads = os.getenv('ACHILLES_THREAD_COUNT')
        setDBDriverEnvString = getSetDBDriverEnvString()
        connectionDetailsString = getDatabaseConnectorConnectionDetailsString(
            databaseCode, releaseDate, PG_TENANT_USERS.ADMIN_USER)

        logger.info('Running achilles')

        with conversion.localconverter(default_converter):
            robjects.r(f'''
                    .libPaths(c('{r_libs_user_directory}',.libPaths()))
                    library('Achilles', lib.loc = '{r_libs_user_directory}')
                    {setDBDriverEnvString}
                    {connectionDetailsString}
                    cdmVersion <- '{cdmVersionNumber}'
                    cdmDatabaseSchema <- '{schemaName}'
                    vocabDatabaseSchema <- '{vocabSchemaName}'
                    resultsDatabaseSchema <- '{resultsSchema}'
                    outputFolder <- '{outputFolder}'
                    numThreads <- {threads}
                    createTable <- TRUE
                    sqlOnly <- FALSE
                    excludeAnalysisIds <- c({excludeAnalysisIds})
                    Achilles::achilles( connectionDetails = connectionDetails, cdmVersion = cdmVersion, cdmDatabaseSchema = cdmDatabaseSchema, createTable = createTable, resultsDatabaseSchema = resultsDatabaseSchema, outputFolder = outputFolder, sqlOnly=sqlOnly, numThreads=numThreads, excludeAnalysisIds=excludeAnalysisIds)
            ''')
    except Exception as e:
        raise e


@task
async def execute_export_to_ares(schemaName: str,
                                 databaseCode: str,
                                 vocabSchemaName: str,
                                 releaseDate: str,
                                 resultsSchema: str,
                                 outputFolder: str):
    try:
        logger = get_run_logger()
        setDBDriverEnvString = getSetDBDriverEnvString()
        connectionDetailsString = getDatabaseConnectorConnectionDetailsString(
            databaseCode, releaseDate, PG_TENANT_USERS.READ_USER)
        logger.info('Running exportToAres')
        with conversion.localconverter(default_converter):
            robjects.r(f'''
                    .libPaths(c('{r_libs_user_directory}',.libPaths()))
                    library('Achilles', lib.loc = '{r_libs_user_directory}')
                    {setDBDriverEnvString}
                    {connectionDetailsString}
                    cdmDatabaseSchema <- '{schemaName}'
                    vocabDatabaseSchema <- '{vocabSchemaName}'
                    resultsDatabaseSchema <- '{resultsSchema}'
                    outputPath <- '{outputFolder}'
                    Achilles::exportToAres(
                        connectionDetails = connectionDetails,
                        cdmDatabaseSchema = cdmDatabaseSchema,
                        resultsDatabaseSchema = resultsDatabaseSchema,
                        vocabDatabaseSchema = vocabDatabaseSchema,
                        outputPath,
                        reports = c()
                    )
            ''')
    except Exception as e:
        raise e


@task
async def create_data_characterization_schema(
    databaseCode: str,
    resultsSchema: str,
    vocabSchemaName: str,
    flowName: str,
    changelog_filepath: str
):
    logger = get_run_logger()
    try:
        databaseDialect = get_db_svc_endpoint_dialect(databaseCode)
        request_url = f"/alpdb/{databaseDialect}/dataCharacterization/database/{databaseCode}/schema/{resultsSchema}"
        request_body = {"vocabSchema": vocabSchemaName,
                        "cdmSchema": vocabSchemaName}

        request_body = _add_plugin_options(
            request_body, databaseDialect, flowName, changelog_filepath)

        await _run_db_svc_shell_command(
            "post", request_url, request_body)
    except Exception as e:
        logger.error(e)
        raise e


def execute_data_characterization_flow(options: dcOptionsType):
    logger = get_run_logger()

    schemaName = options.schemaName
    databaseCode = options.databaseCode
    cdmVersionNumber = options.cdmVersionNumber
    vocabSchemaName = options.vocabSchemaName
    releaseDate = options.releaseDate
    resultsSchema = options.resultsSchema
    flowName = options.flowName
    changelogFilepath = options.changelogFilepath

    # comma separated values in a string
    excludeAnalysisIds = options.excludeAnalysisIds

    flow_run_context = FlowRunContext.get().flow_run.dict()
    flow_run_id = str(flow_run_context.get("id"))
    outputFolder = f'/output/{flow_run_id}'

    foldersToCreate = f"{outputFolder}/{schemaName}"
    logger.debug(f"Output directory to be created {foldersToCreate}")

    # Prepare directories for the run
    os.makedirs(
        f"{foldersToCreate}", 0o777, True)

    create_data_characterization_schema(
        databaseCode,
        resultsSchema,
        vocabSchemaName,
        flowName,
        changelogFilepath
    )

    execute_data_characterization_wo = execute_data_characterization.with_options(on_failure=[
        partial(persist_data_characterization, **
                dict(output_folder=outputFolder))
    ])
    execute_data_characterization_wo(schemaName,
                                     databaseCode,
                                     cdmVersionNumber,
                                     vocabSchemaName,
                                     releaseDate,
                                     resultsSchema,
                                     excludeAnalysisIds,
                                     outputFolder)

    ares_base_hook = partial(persist_export_to_ares, **
                             dict(output_folder=outputFolder, schema_name=schemaName))
    execute_export_to_ares_wo = execute_export_to_ares.with_options(
        on_completion=[ares_base_hook],
        on_failure=[ares_base_hook]
    )
    execute_export_to_ares_wo(schemaName, databaseCode,
                              vocabSchemaName,
                              releaseDate,
                              resultsSchema,
                              outputFolder)
