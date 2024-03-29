import json
from prefect import task, get_run_logger
from rpy2 import robjects
from rpy2.robjects import conversion, default_converter
# from rpy2.robjects.packages import importr
from utils.databaseConnectionUtils import getDatabaseConnectorConnectionDetailsString
from utils.types import PG_TENANT_USERS, StrategusAnalysisType, StrategusOptionsType

@task
def execute_strategus(analysis_spec: StrategusAnalysisType, options: StrategusOptionsType):
    logger = get_run_logger()
    work_schema = options['workSchema']
    cdm_schema = options['cdmSchema']
    database_code = options['databaseCode']
    connectionDetailsString = getDatabaseConnectorConnectionDetailsString(database_code, None, PG_TENANT_USERS.ADMIN_USER)

    # rjsonlite = importr('jsonlite')
    # rstrategus = importr('Strategus')
    # rsharedResources = rjsonlite.fromJSON(json.dumps(analysis_spec['sharedResources']), simplifyVector = False)
    # rmoduleSpecifications = rjsonlite.fromJSON(json.dumps(analysis_spec['moduleSpecifications']), simplifyVector = False)


    sharedResources = json.dumps(analysis_spec['sharedResources'])
    moduleSpecifications = json.dumps(analysis_spec['moduleSpecifications'])

    sharedResources = sharedResources.replace('\\r', '')
    sharedResources = sharedResources.replace('\\n', '')
    sharedResources = sharedResources.replace('\\t', '')
    sharedResources = sharedResources.replace('\\\"', '\\\\\\"')

    with conversion.localconverter(default_converter):
        robjects.r(f'''
            library(jsonlite)
            library(Strategus)
            
            # Default keyring system is required, however it is unused in the context of ALP
            if(!"system" %in% keyring::keyring_list()){{
                # to check whether password can be avoided or not
                keyring::keyring_create(keyring = 'system', password = 'dummy')  
            }}

            {connectionDetailsString}
            print("{logger.info('Running Strategus')}")
            # TODO: to check STRATEGUS_KEYRING_PASSWORD
            Sys.setenv(STRATEGUS_KEYRING_PASSWORD = "dummy")
            Sys.setenv("INSTANTIATED_MODULES_FOLDER" = "/tmp/StrategusInstantiatedModules")

            storeConnectionDetails(
                connectionDetails = connectionDetails,
                connectionDetailsReference = 'dbconnection'
            )

            executionSettings <- createCdmExecutionSettings(connectionDetailsReference = 'dbconnection',
                                                            workDatabaseSchema = '{work_schema}',
                                                            cdmDatabaseSchema = '{cdm_schema}',
                                                            workFolder = "/tmp/strategusWork",
                                                            resultsFolder = "/tmp/strategusOutput")

            sharedResources <- '{sharedResources}'
            moduleSpecifications <- '{moduleSpecifications}'
            sharedResources <- fromJSON(sharedResources, simplifyVector = FALSE, unexpected.escape="keep")
            moduleSpecifications <- fromJSON(moduleSpecifications, simplifyVector = FALSE, unexpected.escape="keep")

            analysisSpecifications <- createEmptyAnalysisSpecificiations()
            for(o in sharedResources) {{
                print(o)
                class(o) <- o$attr_class
                # o[[attr_class]] <- NULL
                analysisSpecifications <- addSharedResources(analysisSpecifications, o)
            }}

            for(o in moduleSpecifications) {{
                class(o) <- o$attr_class
                # o[[attr_class]] <- NULL
                analysisSpecifications <- addModuleSpecifications(analysisSpecifications, o)
            }}

            print("{logger.info('Executing Strategus::execute')}")
            execute(analysisSpecifications = analysisSpecifications, executionSettings = executionSettings)
        ''')