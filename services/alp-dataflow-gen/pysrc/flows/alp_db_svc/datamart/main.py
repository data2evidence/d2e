import importlib
from prefect_shell import ShellOperation
from prefect import get_run_logger
from dao.DBDao import DBDao
from utils.types import PG_TENANT_USERS, CreateDataModelType
from flows.alp_db_svc.datamart.datamart import datamart_copy_schema
from flows.alp_db_svc.datamart.types import DATAMART_ACTIONS, CreateDatamartType, TempCreateDataModelType


async def create_datamart(options: CreateDatamartType, temp_create_data_model_options: TempCreateDataModelType):
    logger = get_run_logger()
    target_schema = options.target_schema
    source_schema = options.source_schema
    data_model = options.data_model
    database_code = options.database_code
    snapshot_copy_config = options.snapshot_copy_config
    datamart_action = options.datamart_action

    # TODO: To be used for create_data_model in task #592
    plugin_changelog_filepath = options.plugin_changelog_filepath
    plugin_classpath = options.plugin_classpath

    # TODO: To be removed when create_data_model is implemented in native python in task #592
    dialect = temp_create_data_model_options.dialect
    changelog_filepath = temp_create_data_model_options.changelog_filepath
    flow_name = temp_create_data_model_options.flow_name
    vocab_schema = temp_create_data_model_options.vocab_schema

    # get db connection
    db_dao = DBDao(database_code, source_schema,
                   PG_TENANT_USERS.ADMIN_USER)

    # check if schema exist
    schema_exists = db_dao.check_schema_exists()
    if not schema_exists:
        error_message = f"Create snapshot failure. Source schema: {source_schema} not found."
        logger.error(error_message)
        raise Exception(error_message)

    # create cdm schema
    if datamart_action == DATAMART_ACTIONS.COPY_AS_DB_SCHEMA:
        dbsvc_flow_module = importlib.import_module('flows.alp_db_svc.flow')
        # TODO: To be updated when create_data_model is implemented in native python in task #592
        await dbsvc_flow_module.create_datamodel.fn(
            CreateDataModelType(
                database_code=database_code,
                data_model=data_model,
                schema_name=target_schema,
                cleansed_schema_option=False,
                dialect=dialect,
                flow_name=flow_name,
                changelog_filepath=changelog_filepath,
                vocab_schema=vocab_schema)
        )

    # datamart_copy_schema
    try:
        _, failed_tables = datamart_copy_schema(
            db_dao,
            source_schema,
            target_schema,
            snapshot_copy_config,
            datamart_action
        )
        if len(failed_tables) > 0:
            error_message = f"The following tables has failed datamart creation: {failed_tables}"
            logger.error(error_message)
            raise Exception(error_message)
    except Exception as err:
        error_message = f"Schema: {target_schema} created successful, but failed to load data with Error: {err}"
        logger.error(error_message)
        raise Exception(error_message)
    else:
        logger.info(
            f"{target_schema} schema created and loaded from source schema: {source_schema} with configuration {snapshot_copy_config}")
