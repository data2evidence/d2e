import sys
import os
import json
from prefect import task
from prefect_shell import ShellOperation
from d2e_dbsvc.types import (requestType, createDataModelType, updateDataModelType, internalPluginType,
                             createSnapshotType, createParquetSnapshotType, rollbackTagType,
                             rollbackCountType, questionniareDefinitionType, questionnaireResponseType)
import importlib


MODULE_DIR = os.path.dirname(__file__)


async def _run_db_svc_shell_command(request_type: str, request_url: str, request_body):
    command = f"npm run cdm-install-script -- {request_type} {request_url} {json.dumps(json.dumps(request_body))}"

    # Temporarily use as default class path for dbsvc endpoints not using plugin
    os.environ["DEFAULT_MIGRATION_SCRIPTS_PATH"] = f"{MODULE_DIR}/nodejs/dbsvc_files/migration_scripts/"

    print(f"Running DBSvc Command: {command}")
    await ShellOperation(
        commands=[
            "cd /app/libs",
            ". generated-env.sh",
            f"cd {MODULE_DIR}/nodejs/dbsvc_files",
            command]).run()


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

    # if flow is run from plugin
    if options.flow_name:
        if options.flow_name == internalPluginType.DATAMODEL_PLUGIN:
            sys.path.append('/app/pysrc')
            alpconnection_module = importlib.import_module(
                'alpconnection.dbutils')
            db_dialect = alpconnection_module.get_db_svc_endpoint_dialect(
                database_code)
        else:
            db_dialect = options.dialect

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

    if update_count == 0:
        request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/schema/{schema_name}"
    elif update_count > 0:
        request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/schema/{schema_name}/update_count/{update_count}"

    await _run_db_svc_shell_command(request_type, request_url, request_body)


@task
async def update_datamodel(options: updateDataModelType):

    database_code = options.database_code
    data_model = options.data_model
    schema_name = options.schema_name

    request_type = requestType.PUT
    request_body = {"vocabSchema": options.vocab_schema}

    # if flow is run from plugin
    if options.flow_name:
        if options.flow_name == internalPluginType.DATAMODEL_PLUGIN:
            sys.path.append('/app/pysrc')
            alpconnection_module = importlib.import_module(
                'alpconnection.dbutils')
            db_dialect = alpconnection_module.get_db_svc_endpoint_dialect(
                database_code)
        else:
            db_dialect = options.dialect

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

    request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}?schema={schema_name}"

    await _run_db_svc_shell_command(request_type, request_url, request_body)


@task
async def create_snapshot(options: createSnapshotType):

    database_code = options.database_code
    data_model = options.data_model
    schema_name = options.schema_name
    source_schema = options.source_schema

    request_type = requestType.POST
    request_body = {"snapshotCopyConfig": options.snapshot_copy_config}

    # if flow is run from plugin
    if options.flow_name:
        if options.flow_name == internalPluginType.DATAMODEL_PLUGIN:
            sys.path.append('/app/pysrc')
            alpconnection_module = importlib.import_module(
                'alpconnection.dbutils')
            db_dialect = alpconnection_module.get_db_svc_endpoint_dialect(
                database_code)
        else:
            db_dialect = options.dialect

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

    request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/schemasnapshot/{schema_name}?source_schema={source_schema}"

    if db_dialect == "hana":
        await _run_db_svc_shell_command(request_type, request_url, request_body)
    elif db_dialect == "postgres":
        # run other flow.py
        pass


@task
async def create_parquet_snapshot(options: createParquetSnapshotType):

    database_code = options.database_code
    data_model = options.data_model
    schema_name = options.schema_name
    source_schema = options.source_schema

    request_type = requestType.POST
    request_body = {"snapshotCopyConfig": options.snapshot_copy_config}

    # if flow is run from plugin
    if options.flow_name:
        if options.flow_name == internalPluginType.DATAMODEL_PLUGIN:
            sys.path.append('/app/pysrc')
            alpconnection_module = importlib.import_module(
                'alpconnection.dbutils')
            db_dialect = alpconnection_module.get_db_svc_endpoint_dialect(
                database_code)
        else:
            db_dialect = options.dialect

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

    request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/schemasnapshotparquet/{schema_name}?sourceschema={source_schema}"

    if db_dialect == "hana":
        await _run_db_svc_shell_command(request_type, request_url, request_body)
    elif db_dialect == "postgres":
        # run other flow.py
        pass


@task
async def rollback_tag(options: rollbackTagType):

    database_code = options.database_code
    data_model = options.data_model
    schema_name = options.schema_name
    rollback_tag = options.rollback_tag

    request_type = requestType.DELETE
    request_body = {}

    # if flow is run from plugin
    if options.flow_name:
        if options.flow_name == internalPluginType.DATAMODEL_PLUGIN:
            sys.path.append('/app/pysrc')
            alpconnection_module = importlib.import_module(
                'alpconnection.dbutils')
            db_dialect = alpconnection_module.get_db_svc_endpoint_dialect(
                database_code)
        else:
            db_dialect = options.dialect

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

    request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/tag/{rollback_tag}?schema={schema_name}"

    await _run_db_svc_shell_command(request_type, request_url, request_body)


@task
async def rollback_count(options: rollbackCountType):

    database_code = options.database_code
    data_model = options.data_model
    schema_name = options.schema_name
    rollback_count = options.rollback_count

    request_type = requestType.DELETE
    request_body = {}

    # if flow is run from plugin
    if options.flow_name:
        if options.flow_name == internalPluginType.DATAMODEL_PLUGIN:
            sys.path.append('/app/pysrc')
            alpconnection_module = importlib.import_module(
                'alpconnection.dbutils')
            db_dialect = alpconnection_module.get_db_svc_endpoint_dialect(
                database_code)
        else:
            db_dialect = options.dialect

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

    request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/count/{rollback_count}/?schema={schema_name}"

    await _run_db_svc_shell_command(request_type, request_url, request_body)


@task
async def get_version_info():
    pass


@task
async def create_questionnaire_definition(options: questionniareDefinitionType):
    database_code = options.database_code
    schema_name = options.schema_name
    data_model = options.data_model  # not used but should only work with omop5-4

    request_type = requestType.POST
    request_body = {"definition": options.questionnaire_definition}

    # if flow is run from plugin
    if options.flow_name:
        if options.flow_name == internalPluginType.DATAMODEL_PLUGIN:
            sys.path.append('/app/pysrc')
            alpconnection_module = importlib.import_module(
                'alpconnection.dbutils')
            db_dialect = alpconnection_module.get_db_svc_endpoint_dialect(
                database_code)
        else:
            db_dialect = options.dialect

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

    request_url = f"/alpdb/{db_dialect}/database/{database_code}/schema/{schema_name}"

    await _run_db_svc_shell_command(request_type, request_url, request_body)


@task
async def get_questionnaire_response(options: questionnaireResponseType):
    database_code = options.database_code
    schema_name = options.schema_name
    data_model = options.data_model  # not used but should only work with omop5-4
    questionnaire_id = options.questionnaire_id

    request_type = requestType.GET
    request_body = {}

    # if flow is run from plugin
    if options.flow_name:
        if options.flow_name == internalPluginType.DATAMODEL_PLUGIN:
            sys.path.append('/app/pysrc')
            alpconnection_module = importlib.import_module(
                'alpconnection.dbutils')
            db_dialect = alpconnection_module.get_db_svc_endpoint_dialect(
                database_code)
        else:
            db_dialect = options.dialect

        request_body = _add_plugin_options(
            request_body, db_dialect, options.flow_name, options.changelog_filepath)

    request_url = f"/alpdb/{db_dialect}/database/{database_code}/schema/{schema_name}/questionnaire/{questionnaire_id}"

    await _run_db_svc_shell_command(request_type, request_url, request_body)


def _add_plugin_options(request_body, dialect: str, flow_name: str, changelog_filepath: str):
    cwd = os.getcwd()
    request_body["customClasspath"] = f'{cwd}/{flow_name}/'
    request_body["customChangelogFilepath"] = f'db/migrations/{dialect}/{changelog_filepath}'
    return request_body
