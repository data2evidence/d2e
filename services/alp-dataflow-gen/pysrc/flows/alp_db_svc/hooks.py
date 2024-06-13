from prefect.logging.loggers import task_run_logger
from prefect.server.schemas.states import StateType
from dao.DBDao import DBDao


def create_dataset_schema_hook(task, task_run, state, schema_dao: DBDao):
    logger = task_run_logger(task_run, task)

    if state.type == StateType.COMPLETED:
        msg = ""
        logger.info(msg)
    elif state.type == StateType.FAILED:
        msg = ""
        logger.info(msg)


def drop_schema_hook(task, task_run, state, schema_dao: DBDao):
    logger = task_run_logger(task_run, task)
    logger.info(
        f"Dropping schema {schema_dao.database_code}.{schema_dao.schema_name}")
    try:
        drop_schema = schema_dao.drop_schema()
        msg = ""
        logger.info(msg)
    except Exception as e:
        logger.info(
            f"Failed to drop schema {schema_dao.database_code}.{schema_dao.schema_name}")
    else:
        logger.info(
            f"Successfully drop schema {schema_dao.database_code}.{schema_dao.schema_name}")


def update_cdm_version_hook(task, task_run, state, db: str, schema: str):
    logger = task_run_logger(task_run, task)
    if state.type == StateType.COMPLETED:
        msg = ""
        logger.info(msg)
    elif state.type == StateType.FAILED:
        msg = ""
        logger.info(msg)


def update_schema_hook(task, task_run, state, db: str, schema: str):
    logger = task_run_logger(task_run, task)
    if state.type == StateType.COMPLETED:
        msg = ""
        logger.info(msg)
    elif state.type == StateType.FAILED:
        msg = ""
        logger.info(msg)


def rollback_count_hook(task, task_run, state, db: str, schema: str):
    logger = task_run_logger(task_run, task)
    if state.type == StateType.COMPLETED:
        msg = ""
        logger.info(msg)
    elif state.type == StateType.FAILED:
        msg = ""
        logger.info(msg)


def rollback_tag_hook(task, task_run, state, db: str, schema: str):
    logger = task_run_logger(task_run, task)
    if state.type == StateType.COMPLETED:
        msg = ""
        logger.info(msg)
    elif state.type == StateType.FAILED:
        msg = ""
        logger.info(msg)
