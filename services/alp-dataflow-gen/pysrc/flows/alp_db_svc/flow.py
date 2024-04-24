from prefect import flow, task, get_run_logger
from dao.DBDao import DBDao
from prefect_shell import ShellOperation
import json
import os
import site
from alpconnection.dbutils import get_db_svc_endpoint_dialect
from utils.types import (PG_TENANT_USERS, AlpDBSvcOptionsType,
                         requestType, internalPluginType,
                         createDataModelType, updateDataModelType,
                         createSnapshotType, createParquetSnapshotType,
                         rollbackTagType, rollbackCountType,
                         questionnaireDefinitionType, questionnaireResponseType,
                         dcOptionsType)


MODULE_DIR = site.getsitepackages()[0]


def run_alp_db_svc(options: AlpDBSvcOptionsType):
    request_type = options.requestType
    request_url = options.requestUrl
    request_body = options.requestBody if options.requestBody else {}
    try:
        run_command(request_type, request_url, request_body)
    except Exception as e:
        get_run_logger().error(f"{e}")


def run_seed_postgres(database_code: str, vocab_schema_name: str, cdm_schema_name: str):
    vocab_schema_exists = create_schema_flow(
        database_code, vocab_schema_name, vocab_schema_name)
    if vocab_schema_exists:
        cdmdefault_schema_exists = create_schema_flow(
            database_code, cdm_schema_name, vocab_schema_name)
        if cdmdefault_schema_exists:
            load_data_flow(database_code, cdm_schema_name)
    create_schema_flow(database_code, 'fhir_data', vocab_schema=None)


@task
async def run_command(request_type: str, request_url: str, request_body):
    logger = get_run_logger()
    try:
        _run_db_svc_shell_command(request_type, request_url, request_body)
    except Exception as e:
        logger.error(e)
        raise e


@flow
def create_schema_flow(database_code: str, schema_name: str, vocab_schema: str = None):
    schema_obj = DBDao(database_code, schema_name, PG_TENANT_USERS.ADMIN_USER)
    schema_exists = check_seed_schema_exists(schema_obj)
    if (schema_exists == False):
        try:
            if schema_name == 'fhir_data':
                run_command(
                    request_type="post",
                    request_url=f"/alpdb/postgres/database/{database_code}/staging-area/fhir_data/schema/{schema_name}",
                    request_body={}
                )
            else:
                run_command(
                    request_type="post",
                    request_url=f"/alpdb/postgres/database/{database_code}/data-model/omop5-4/schema/{schema_name}",
                    request_body={"cleansedSchemaOption": False,
                                  "vocabSchema": vocab_schema}
                )
        except Exception as e:
            get_run_logger().error(
                f"Failed to create schema {schema_name} in db with code:{database_code}: {e}")
            return False
        else:
            return True
    else:
        return True


@flow
def load_data_flow(database_code: str, schema_name: str):
    try:
        run_command(request_type="put",
                    request_url=f"/alpdb/postgres/database/{database_code}/importdata?schema={schema_name}", request_body={"filePath": "/app/synpuf1k"})
    except Exception as e:
        get_run_logger().error(
            f"Failed to load data into schema {schema_name} in db with code:{database_code}: {e}")
        return False
    else:
        return True


@task
def check_seed_schema_exists(schema_obj) -> bool:
    return schema_obj.check_schema_exists()


async def _run_db_svc_shell_command(request_type: str, request_url: str, request_body):
    command = f"npm run cdm-install-script -- {request_type} {request_url} {json.dumps(json.dumps(request_body))}"

    # Temporarily use as default class path for dbsvc endpoints not using plugin
    os.environ["DEFAULT_MIGRATION_SCRIPTS_PATH"] = f"{MODULE_DIR}/nodejs/dbsvc_files/migration_scripts/"

    print(f"Running DBSvc Command: {command}")
    await ShellOperation(
        commands=[
            "cd /app/libs",
            ". generated-env.sh",
            f"cd {MODULE_DIR}/d2e_dbsvc//nodejs/dbsvc_files",
            command]).run()


def _add_plugin_options(request_body, dialect: str, flow_name: str, changelog_filepath: str):  # move to utils?
    cwd = os.getcwd()
    request_body["customClasspath"] = f'{cwd}/{flow_name}/'
    request_body["customChangelogFilepath"] = f'db/migrations/{dialect}/{changelog_filepath}'
    return request_body


def _get_db_dialect(options):
    if (options.flow_name == internalPluginType.DATAMODEL_PLUGIN) or (options.flow_name == internalPluginType.DATAMODEL_PLUGIN):
        return get_db_svc_endpoint_dialect(options.database_code)
    else:
        return options.dialect


@task
async def create_datamodel(options: createDataModelType):
    database_code = options.database_code
    data_model = options.data_model
    schema_name = options.schema_name
    update_count = options.update_count

    request_type = requestType.POST
    request_body = {
        "cleansedSchemaOption": options.cleansed_schema_option,
        "vocabSchema": options.vocab_schema}

    try:
        db_dialect = _get_db_dialect(options)

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

        if update_count == 0:
            request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/schema/{schema_name}"
        elif update_count > 0:
            request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/schema/{schema_name}/update_count/{update_count}"

        await _run_db_svc_shell_command(request_type, request_url, request_body)
    except Exception as e:
        raise e


@task
async def update_datamodel(options: updateDataModelType):
    database_code = options.database_code
    data_model = options.data_model
    schema_name = options.schema_name

    request_type = requestType.PUT
    request_body = {"vocabSchema": options.vocab_schema}

    try:
        db_dialect = _get_db_dialect(options)

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

        request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}?schema={schema_name}"

        await _run_db_svc_shell_command(request_type, request_url, request_body)
    except Exception as e:
        raise e


@task
async def create_snapshot(options: createSnapshotType):
    database_code = options.database_code
    data_model = options.data_model
    schema_name = options.schema_name
    source_schema = options.source_schema

    request_type = requestType.POST
    request_body = {"snapshotCopyConfig": options.snapshot_copy_config}

    try:
        db_dialect = _get_db_dialect(options)

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

        request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/schemasnapshot/{schema_name}?source_schema={source_schema}"

        if db_dialect == "hana":
            await _run_db_svc_shell_command(request_type, request_url, request_body)
    except Exception as e:
        raise e


@task
async def create_parquet_snapshot(options: createParquetSnapshotType):
    database_code = options.database_code
    data_model = options.data_model
    schema_name = options.schema_name
    source_schema = options.source_schema

    request_type = requestType.POST
    request_body = {"snapshotCopyConfig": options.snapshot_copy_config}

    try:
        db_dialect = _get_db_dialect(options)

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

        request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/schemasnapshotparquet/{schema_name}?sourceschema={source_schema}"

        if db_dialect == "hana":
            await _run_db_svc_shell_command(request_type, request_url, request_body)
    except Exception as e:
        raise e


@task
async def rollback_tag(options: rollbackTagType):
    database_code = options.database_code
    data_model = options.data_model
    schema_name = options.schema_name
    rollback_tag = options.rollback_tag

    request_type = requestType.DELETE
    request_body = {}

    try:
        db_dialect = _get_db_dialect(options)

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

        request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/tag/{rollback_tag}?schema={schema_name}"

        await _run_db_svc_shell_command(request_type, request_url, request_body)
    except Exception as e:
        raise e


@task
async def rollback_count(options: rollbackCountType):
    database_code = options.database_code
    data_model = options.data_model
    schema_name = options.schema_name
    rollback_count = options.rollback_count

    request_type = requestType.DELETE
    request_body = {}

    try:
        db_dialect = _get_db_dialect(options)

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

        request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/count/{rollback_count}/?schema={schema_name}"

        await _run_db_svc_shell_command(request_type, request_url, request_body)
    except Exception as e:
        raise e


@task
async def create_questionnaire_definition(options: questionnaireDefinitionType):
    database_code = options.database_code
    schema_name = options.schema_name
    data_model = options.data_model  # not used but should only work with omop5-4

    request_type = requestType.POST
    request_body = {"definition": options.questionnaire_definition}

    try:
        db_dialect = _get_db_dialect(options)

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

        request_url = f"/alpdb/{db_dialect}/database/{database_code}/schema/{schema_name}"

        await _run_db_svc_shell_command(request_type, request_url, request_body)
    except Exception as e:
        raise e


@task
async def get_questionnaire_response(options: questionnaireResponseType):
    database_code = options.database_code
    schema_name = options.schema_name
    questionnaire_id = options.questionnaire_id

    request_type = requestType.GET
    request_body = {}

    try:
        db_dialect = _get_db_dialect(options)

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

        request_url = f"/alpdb/{db_dialect}/database/{database_code}/schema/{schema_name}/questionnaire/{questionnaire_id}"

        await _run_db_svc_shell_command(request_type, request_url, request_body)
    except Exception as e:
        raise e
