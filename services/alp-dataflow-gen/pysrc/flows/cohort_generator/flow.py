import os
import sys
import asyncio
import json
from rpy2 import robjects
from rpy2.robjects import conversion, default_converter
from prefect import task, get_run_logger
from prefect.filesystems import S3
from utils.types import PG_TENANT_USERS, cohortGeneratorOptionsType
from utils.databaseConnectionUtils import getSetDBDriverEnvString, getDatabaseConnectorConnectionDetailsString
from api.AnalyticsSvcAPI import AnalyticsSvcAPI


def execute_cohort_generator(
    options: cohortGeneratorOptionsType
):
    logger = get_run_logger()
    logger.info('Running Cohort Generator')
    databaseCode = options.databaseCode
    schemaName = options.schemaName
    vocabSchemaName = options.vocabSchemaName
    cohortJson = options.cohortJson
    datasetId = options.datasetId
    description = options.description
    owner = options.owner
    token = options.token

    cohortJsonExpression = json.dumps(cohortJson.expression)
    cohortName = cohortJson.name

    cohortDefinitionId = create_cohort_definition(token,
                                                  datasetId,
                                                  description,
                                                  owner,
                                                  cohortJsonExpression,
                                                  cohortName,)

    create_cohort(databaseCode,
                  schemaName,
                  cohortDefinitionId,
                  cohortJsonExpression,
                  cohortName, vocabSchemaName)


@task(result_storage=S3(bucket_path="dataflow-results/cohort-generator"), 
      result_storage_key="{flow_run.id}_cohort_definition.txt")
def create_cohort_definition(token: str, datasetId: str, description: str, owner: str, cohortJsonExpression: str, cohortName: str):
    anaylticsSvcApi = AnalyticsSvcAPI(token)
    result = anaylticsSvcApi.create_cohort_definition(
        datasetId=datasetId,
        description=description,
        owner=owner,
        syntax=cohortJsonExpression,
        name=cohortName
    )
    return result


@task
def create_cohort(databaseCode: str, schemaName: str, cohortDefinitionId: int, cohortJsonExpression: str, cohortName: str, vocabSchemaName: str):
    setDBDriverEnvString = getSetDBDriverEnvString()
    connectionDetailsString = getDatabaseConnectorConnectionDetailsString(
        databaseCode, None, PG_TENANT_USERS.ADMIN_USER)
    r_libs_user_directory = os.getenv("R_LIBS_USER")
    with conversion.localconverter(default_converter):
        robjects.r(f'''
                .libPaths(c('{r_libs_user_directory}',.libPaths()))
                library('CohortGenerator', lib.loc = '{r_libs_user_directory}')
                {setDBDriverEnvString}
                {connectionDetailsString}
                cohortJson <- '{cohortJsonExpression}'
                schemaName <- '{schemaName}'
                vocabSchemaName <- '{vocabSchemaName}'
                cohortName <- '{cohortName}'
                cohortId <- '{cohortDefinitionId}'
                
                cat("Generating cohort sql from cohort expression from json")
                cohortExpression <- CirceR::cohortExpressionFromJson(cohortJson)
                options <- CirceR::createGenerateOptions(generateStats = FALSE, vocabularySchema = vocabSchemaName);
                cohortSql <- CirceR::buildCohortQuery(cohortExpression, options = options)
                
                cat("Creating tempoary cohort stats table names")
                cohortTableNames <- list()
                cohortTableNames[["cohortTable"]] <- "cohort"
                cohortTableNames[["cohortInclusionTable"]] <- sprintf("cohort_inclusion_%s", cohortId)
                cohortTableNames[["cohortInclusionResultTable"]] <- sprintf("cohort_inclusion_result_%s", cohortId)
                cohortTableNames[["cohortInclusionStatsTable"]] <- sprintf("cohort_inclusion_stats_%s", cohortId)
                cohortTableNames[["cohortSummaryStatsTable"]] <- sprintf("cohort_summary_stats_%s", cohortId)
                cohortTableNames[["cohortCensorStatsTable"]] <- sprintf("cohort_censor_stats_%s", cohortId)
                
                cat("Creating tempoary cohort stats tables")
                CohortGenerator::createCohortTables(connectionDetails = connectionDetails,
                                        cohortDatabaseSchema = schemaName,
                                        cohortTableNames = cohortTableNames,
                                        incremental=TRUE)
                                        

                cat("Creating cohorts")
                cohortsToCreate <- CohortGenerator::createEmptyCohortDefinitionSet()
                cohortsToCreate <- rbind(cohortsToCreate, data.frame(cohortId = cohortId,
                                                    cohortName = cohortName, 
                                                    sql = cohortSql,
                                                    stringsAsFactors = FALSE))       
                cohortsGenerated <- CohortGenerator::generateCohortSet(connectionDetails = connectionDetails,
                                                    cdmDatabaseSchema = schemaName,
                                                    cohortDatabaseSchema = schemaName,
                                                    cohortTableNames = cohortTableNames,
                                                    cohortDefinitionSet = cohortsToCreate)


                cat("Dropping tempoary cohort stats tables")
                CohortGenerator::dropCohortStatsTables(
                connectionDetails = connectionDetails,
                cohortDatabaseSchema = schemaName,
                cohortTableNames = cohortTableNames
                )
        ''')
