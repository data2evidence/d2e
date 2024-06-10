from flows.alp_db_svc.dataset.main import create_datamodel, update_datamodel, rollback_count_task, rollback_tag_task
from flows.alp_db_svc.datamart.main import create_datamart
from flows.alp_db_svc.datamart.types import DATAMART_FLOW_ACTIONS, DATAMART_ACTIONS, CreateDatamartType
from flows.alp_db_svc.versioninfo.main import get_version_info_task
from flows.alp_db_svc.questionnaire.main import create_questionnaire_definition_task
from flows.alp_db_svc.const import get_plugin_classpath, get_db_dialect
from flows.alp_db_svc.types import (CreateDataModelType, 
                                    UpdateDataModelType, 
                                    GetVersionInfoType,
                                    CreateSnapshotType, 
                                    RollbackCountType,
                                    RollbackTagType,
                                    QuestionnaireDefinitionType)


def run_seed_postgres(options: seedVocabType):
    #Begin by checking if the vocab schema exists or not
    schema_obj = DBDao(options.database_code, options.vocab_schema, PG_TENANT_USERS.ADMIN_USER)
    schema_exists = check_seed_schema_exists(schema_obj)
    
    db_dialect = _get_db_dialect(options)
    request_body = {}
    request_body = _db_svc_flowrun_params(request_body, db_dialect, options.flow_name, options.changelog_filepath)
    
    if (schema_exists == False):
        try:
            request_body["cleansedSchemaOption"] = False
            request_body["vocabSchema"] = options.vocab_schema
            run_command(
                request_type="post",
                request_url=f"/alpdb/postgres/database/{options.database_code}/data-model/omop5-4/schema/{options.vocab_schema}",
                request_body=request_body
            )
        except Exception as e:
            get_run_logger().error(
                f"Failed to create schema {options.vocab_schema} in db with code:{options.database_code}: {e}")
            return False
        
    if(options.schema_name != options.vocab_schema):
        #Check if the incoming schema_name exists or not
        schema_obj = DBDao(options.database_code, options.schema_name, PG_TENANT_USERS.ADMIN_USER)
        schema_exists = check_seed_schema_exists(schema_obj)
        if (schema_exists == False):
            try:
                run_command(
                    request_type="post",
                    request_url=f"/alpdb/postgres/database/{options.database_code}/data-model/omop5-4/schema/{options.schema_name}",
                    request_body=request_body
                )
            except Exception as e:
                get_run_logger().error(
                    f"Failed to create schema {options.schema_name} in db with code:{options.database_code}: {e}")
                return False
    load_data_flow(options.database_code, options.schema_name)


def create_datamodel_flow(options: CreateDataModelType):
    try:
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
            dialect=get_db_dialect(options.database_code)
        )
    except Exception as e:
        raise e

    
def update_datamodel_flow(options: UpdateDataModelType):
    try:
        update_datamodel(
            database_code=options.database_code,
            data_model=options.data_model,
            schema_name=options.schema_name,
            vocab_schema=options.vocab_schema,
            changelog_file=options.changelog_filepath_list.get(
                options.data_model),
            plugin_classpath=get_plugin_classpath(options.flow_name),
            dialect=get_db_dialect(options.database_code)
        )
    except Exception as e:
        raise e


def get_version_flow(options: GetVersionInfoType):
    get_version_info_task(
        changelog_file=options.changelog_filepath_list.get(
            options.data_model),
        plugin_classpath=get_plugin_classpath(options.flow_name),
        token=options.token
    )


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


async def create_snapshot_flow(options: CreateSnapshotType):
    flow_action_type = options.flow_action_type
    
    try:
        db_dialect = get_db_dialect(options)

        match flow_action_type:
            case DATAMART_FLOW_ACTIONS.create_snapshot:
                create_datamart_options = _parse_create_datamart_options(
                    options, db_dialect, DATAMART_ACTIONS.COPY_AS_DB_SCHEMA
                )
            case DATAMART_FLOW_ACTIONS.create_parquet_snapshot:
                create_datamart_options = _parse_create_datamart_options(
                    options, db_dialect, DATAMART_ACTIONS.COPY_AS_PARQUET_FILE)
        await create_datamart(options=create_datamart_options)
    except Exception as e:
        raise e


def rollback_count_flow(options: RollbackCountType):
    try:
        rollback_count_task(
            database_code=options.database_code,
            data_model=options.data_model,
            schema_name=options.schema_name,
            vocab_schema=options.vocab_schema,
            changelog_file=options.changelog_filepath_list.get(options.data_model),
            plugin_classpath=get_plugin_classpath(options.flow_name),
            dialect=get_db_dialect(options.database_code),
            rollback_count=options.rollback_count
        )
    except Exception as e:
        raise e
 

def rollback_tag_flow(options: RollbackTagType):
    try:
        rollback_tag_task(
            database_code=options.database_code,
            data_model=options.data_model,
            schema_name=options.schema_name,
            vocab_schema=options.vocab_schema,
            changelog_file=options.changelog_filepath_list.get(options.data_model),
            plugin_classpath=get_plugin_classpath(options.flow_name),
            dialect=get_db_dialect(options.database_code),
            rollback_tag=options.rollback_tag
        )
    except Exception as e:
        raise e


def create_questionnaire_definition_flow(options: QuestionnaireDefinitionType):
    questionnaire_definition = options.questionnaire_definition
    schema_name = options.schema_name
    database_code = options.database_code
    db_dialect = get_db_dialect(options)

    create_questionnaire_definition_task(
        database_code=database_code,
        schema_name=schema_name,
        dialect=db_dialect,
        questionnaire_definition=questionnaire_definition
    )
