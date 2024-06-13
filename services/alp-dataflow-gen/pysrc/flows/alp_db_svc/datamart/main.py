from prefect import get_run_logger
from dao.DBDao import DBDao
from utils.types import PG_TENANT_USERS, HANA_TENANT_USERS, DatabaseDialects
from flows.alp_db_svc.datamart.datamart import datamart_copy_schema
from flows.alp_db_svc.datamart.types import DATAMART_FLOW_ACTIONS, CreateDatamartType
from flows.alp_db_svc.dataset.main import create_datamodel


def create_datamart(options: CreateDatamartType):
    logger = get_run_logger()
    target_schema = options.target_schema
    source_schema = options.source_schema
    data_model = options.data_model
    database_code = options.database_code
    snapshot_copy_config = options.snapshot_copy_config
    datamart_action = options.datamart_action
    dialect = options.dialect
    vocab_schema = options.vocab_schema
    changelog_file = options.changelog_file
    plugin_classpath = options.plugin_classpath

    # get db connection
    match dialect:
        case DatabaseDialects.HANA:
            admin_user = HANA_TENANT_USERS.ADMIN_USER
        case DatabaseDialects.POSTGRES:
            admin_user = PG_TENANT_USERS.ADMIN_USER

    # get db connection
    db_dao = DBDao(database_code, source_schema, admin_user)

    # check if schema exist
    schema_exists = db_dao.check_schema_exists()
    if not schema_exists:
        error_message = f"Create snapshot failure. Source schema: {source_schema} not found."
        logger.error(error_message)
        raise Exception(error_message)

    # create cdm schema
    if datamart_action == DATAMART_FLOW_ACTIONS.CREATE_SNAPSHOT:
        create_datamodel(
            database_code=database_code,
            data_model=data_model,
            schema_name=target_schema,
            vocab_schema=vocab_schema,
            changelog_file=changelog_file,
            count=0,
            cleansed_schema_option=False,
            plugin_classpath=plugin_classpath,
            dialect=dialect
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
