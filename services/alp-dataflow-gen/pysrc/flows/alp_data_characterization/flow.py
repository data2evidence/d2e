import os
from functools import partial

from rpy2 import robjects
from rpy2.robjects import conversion, default_converter

from prefect import task, get_run_logger
from prefect.context import FlowRunContext
from prefect.serializers import JSONSerializer
from prefect.filesystems import RemoteFileSystem as RFS

from utils import DBUtils
from utils.types import dcOptionsType, UserType

from dao import DqdResultDao

from flows.alp_db_svc.dataset.main import create_datamodel
from flows.alp_db_svc.const import get_plugin_classpath

from flows.alp_data_characterization.hooks import (persist_data_characterization, 
                                                   persist_export_to_ares, 
                                                   get_export_to_ares_results_from_file)


r_libs_user_directory = os.getenv("R_LIBS_USER")


@task
async def execute_data_characterization(schemaName: str,
                                        cdmVersionNumber: str,
                                        vocabSchemaName: str,
                                        releaseDate: str,
                                        resultsSchema: str,
                                        excludeAnalysisIds: str,
                                        outputFolder: str,
                                        dbutils: DBUtils):
    try:
        logger = get_run_logger()
        threads = os.getenv('ACHILLES_THREAD_COUNT')
        setDBDriverEnvString = dbutils.set_db_driver_env()
        connectionDetailsString = dbutils.get_database_connector_connection_string(
            UserType.ADMIN_USER,
            releaseDate)
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


@task(result_storage=RFS.load(os.getenv("DATAFLOW_MGMT__FLOWS__RESULTS_SB_NAME")), 
      result_storage_key="{flow_run.id}_export_to_ares.json",
      result_serializer=JSONSerializer(),
      persist_result=True)
async def execute_export_to_ares(schemaName: str,
                                 vocabSchemaName: str,
                                 releaseDate: str,
                                 resultsSchema: str,
                                 outputFolder: str,
                                 dbutils: DBUtils):
    try:
        logger = get_run_logger()
        setDBDriverEnvString = dbutils.set_db_driver_env()
        connectionDetailsString = dbutils.get_database_connector_connection_string(
            UserType.READ_USER,
            releaseDate)
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
            return get_export_to_ares_results_from_file(outputFolder, schemaName)
    except Exception as e:
        raise e


async def create_data_characterization_schema(
    databaseCode: str,
    resultsSchema: str,
    vocabSchemaName: str,
    flowName: str,
    changelogFile: str,
    dbutils: DBUtils
):
    logger = get_run_logger()
    try:
        plugin_classpath = get_plugin_classpath(flowName)
        dialect = dbutils.get_database_dialect()
        create_datamodel(
            database_code=databaseCode,
            data_model="characterization",
            schema_name=resultsSchema,
            vocab_schema=vocabSchemaName,
            changelog_file=changelogFile,
            count=0,
            cleansed_schema_option=False,
            plugin_classpath=plugin_classpath,
            dialect=dialect
        )
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
    changelogFile = options.changelogFile

    # comma separated values in a string
    excludeAnalysisIds = options.excludeAnalysisIds
    
    

    flow_run_context = FlowRunContext.get().flow_run.dict()
    flow_run_id = str(flow_run_context.get("id"))
    outputFolder = f'/output/{flow_run_id}'

    dbutils = DBUtils(databaseCode)
    dqdresult_dao = DqdResultDao()

    create_data_characterization_schema(
        databaseCode,
        resultsSchema,
        vocabSchemaName,
        flowName,
        changelogFile,
        dbutils
    )

    execute_data_characterization_wo = execute_data_characterization.with_options(on_failure=[
        partial(persist_data_characterization, **
                dict(output_folder=outputFolder, dqdresult_dao=dqdresult_dao))
    ])
    execute_data_characterization_wo(schemaName,
                                     cdmVersionNumber,
                                     vocabSchemaName,
                                     releaseDate,
                                     resultsSchema,
                                     excludeAnalysisIds,
                                     outputFolder)

    ares_base_hook = partial(persist_export_to_ares, **
                             dict(output_folder=outputFolder, schema_name=schemaName, dqdresult_dao=dqdresult_dao))
    execute_export_to_ares_wo = execute_export_to_ares.with_options(
        on_completion=[ares_base_hook],
        on_failure=[ares_base_hook]
    )
    execute_export_to_ares_wo(schemaName,
                              vocabSchemaName,
                              releaseDate,
                              resultsSchema,
                              outputFolder,
                              dbutils)
