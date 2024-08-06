from flows.alp_db_svc.dataset.main import create_datamodel, update_datamodel, rollback_count_task, rollback_tag_task, create_cdm_schema_tasks
from flows.alp_db_svc.datamart.main import create_datamart
from flows.alp_db_svc.datamart.types import DATAMART_FLOW_ACTIONS, CreateDatamartType
from flows.alp_db_svc.versioninfo.main import get_version_info_task
from flows.alp_db_svc.const import get_plugin_classpath, get_db_dialect
from flows.alp_db_svc.types import (CreateDataModelType,
                                    UpdateDataModelType,
                                    GetVersionInfoType,
                                    CreateSnapshotType,
                                    RollbackCountType,
                                    RollbackTagType,
                                    CreateSchemaType)
from prefect import get_run_logger


def create_cdm_schema(options: CreateSchemaType):
    db_dialect = get_db_dialect(options)
    try:
        create_cdm_schema_tasks(
            database_code=options.database_code,
            data_model=options.data_model,
            schema_name=options.schema_name,
            vocab_schema=options.vocab_schema,
            changelog_file=options.changelog_filepath_list.get(
                options.data_model),
            plugin_classpath=get_plugin_classpath(options.flow_name),
            dialect=db_dialect
        )
    except Exception as e:
        get_run_logger().error(e)
        raise (e)


def create_datamodel_flow(options: CreateDataModelType):
    try:
        db_dialect = get_db_dialect(options)
        create_datamodel(
            database_code=options.database_code,
            data_model=options.data_model,
            schema_name=options.schema_name,
            vocab_schema=options.vocab_schema,
            changelog_file=options.changelog_filepath_list.get(
                options.data_model),
            count=options.update_count,
            cleansed_schema_option=options.cleansed_schema_option,
            plugin_classpath=get_plugin_classpath(options.flow_name),
            dialect=db_dialect
        )
    except Exception as e:
        get_run_logger().error(e)
        raise e


def update_datamodel_flow(options: UpdateDataModelType):
    try:
        db_dialect = get_db_dialect(options)

        update_datamodel(
            flow_action_type=options.flow_action_type,
            database_code=options.database_code,
            data_model=options.data_model,
            schema_name=options.schema_name,
            vocab_schema=options.vocab_schema,
            changelog_file=options.changelog_filepath_list.get(
                options.data_model),
            plugin_classpath=get_plugin_classpath(options.flow_name),
            dialect=db_dialect
        )
    except Exception as e:
        get_run_logger().error(e)
        raise e


def get_version_info_flow(options: GetVersionInfoType):
    try:
        get_version_info_task(
            changelog_filepath_list=options.changelog_filepath_list,
            plugin_classpath=get_plugin_classpath(options.flow_name),
            token=options.token,
            dataset_list=options.datasets
        )
    except Exception as e:
        get_run_logger().error(e)
        raise e


def _parse_create_datamart_options(options: CreateSnapshotType,
                                   dialect: str,
                                   datamart_action_type: str) -> CreateDatamartType:
    return CreateDatamartType(
        dialect=dialect,
        target_schema=options.schema_name,
        source_schema=options.source_schema,
        data_model=options.data_model,
        database_code=options.database_code,
        vocab_schema=options.vocab_schema,
        snapshot_copy_config=options.snapshot_copy_config,
        plugin_classpath=get_plugin_classpath(options.flow_name),
        changelog_file=options.changelog_filepath_list.get(options.data_model),
        datamart_action=datamart_action_type
    )


def create_snapshot_flow(options: CreateSnapshotType):
    try:
        flow_action_type = options.flow_action_type
        db_dialect = get_db_dialect(options)

        match flow_action_type:
            case DATAMART_FLOW_ACTIONS.CREATE_SNAPSHOT:
                create_datamart_options = _parse_create_datamart_options(
                    options, db_dialect, DATAMART_FLOW_ACTIONS.CREATE_SNAPSHOT
                )
            case DATAMART_FLOW_ACTIONS.CREATE_PARQUET_SNAPSHOT:
                create_datamart_options = _parse_create_datamart_options(
                    options, db_dialect, DATAMART_FLOW_ACTIONS.CREATE_PARQUET_SNAPSHOT)
        create_datamart(options=create_datamart_options)
    except Exception as e:
        get_run_logger().error(e)
        raise e


def rollback_count_flow(options: RollbackCountType):
    try:
        db_dialect = get_db_dialect(options)

        rollback_count_task(
            database_code=options.database_code,
            data_model=options.data_model,
            schema_name=options.schema_name,
            vocab_schema=options.vocab_schema,
            changelog_file=options.changelog_filepath_list.get(
                options.data_model),
            plugin_classpath=get_plugin_classpath(options.flow_name),
            dialect=db_dialect,
            rollback_count=options.rollback_count
        )
    except Exception as e:
        get_run_logger().error(e)
        raise e


def rollback_tag_flow(options: RollbackTagType):
    try:
        db_dialect = get_db_dialect(options)

        rollback_tag_task(
            database_code=options.database_code,
            data_model=options.data_model,
            schema_name=options.schema_name,
            vocab_schema=options.vocab_schema,
            changelog_file=options.changelog_filepath_list.get(
                options.data_model),
            plugin_classpath=get_plugin_classpath(options.flow_name),
            dialect=db_dialect,
            rollback_tag=options.rollback_tag
        )
    except Exception as e:
        get_run_logger().error(e)
        raise e