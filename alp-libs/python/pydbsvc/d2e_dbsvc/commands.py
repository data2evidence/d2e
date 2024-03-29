import sys
import os
import json
from prefect import task
from prefect_shell import ShellOperation
from d2e_dbsvc.types import createDataModelType, updateDataModelType, internalPluginType
import importlib


module_dir = os.path.dirname(__file__)


async def _run_db_svc_shell_command(request_type: str, request_url: str, request_body):
    command = f"npm run cdm-install-script -- {request_type} {request_url} {json.dumps(json.dumps(request_body))}"

    # Temporarily use as default class path for dbsvc endpoints not using plugin
    os.environ["DEFAULT_MIGRATION_SCRIPTS_PATH"] = f"{module_dir}/nodejs/dbsvc_files/migration_scripts/"

    print(f"Running DBSvc Command: {command}")
    await ShellOperation(
        commands=[
            "cd /app/libs",
            ". generated-env.sh",
            f"cd {module_dir}/nodejs/dbsvc_files",
            command]).run()


@task
async def create_datamodel(create_options: createDataModelType):
    database_code = create_options.database_code
    data_model = create_options.data_model
    schema_name = create_options.schema_name

    request_type = "post"
    request_body = {
        "cleansedSchemaOption": create_options.cleansed_schema_option,
        "vocabSchema": create_options.vocab_schema}

    # if flow is run from plugin
    if create_options.flow_name:
        if create_options.flow_name == internalPluginType.DATAMODEL_PLUGIN:
            sys.path.append('/app/pysrc')
            alpconnection_module = importlib.import_module(
                'alpconnection.dbutils')
            db_dialect = alpconnection_module.get_db_svc_endpoint_dialect(
                database_code)
        else:
            db_dialect = create_options.dialect

        request_body = _add_plugin_options(
            request_body, db_dialect, create_options.flow_name, create_options.changelog_filepath)

    request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}/schema/{schema_name}"

    await _run_db_svc_shell_command(request_type, request_url, request_body)


@task
async def update_datamodel(update_options: updateDataModelType):

    database_code = update_options.database_code
    data_model = update_options.data_model
    schema_name = update_options.schema_name

    request_type = "put"
    request_body = {"vocabSchema": update_options.vocab_schema}

    # if flow is run from plugin
    if update_options.flow_name:
        if update_options.flow_name == internalPluginType.DATAMODEL_PLUGIN:
            sys.path.append('/app/pysrc')
            alpconnection_module = importlib.import_module(
                'alpconnection.dbutils')
            db_dialect = alpconnection_module.get_db_svc_endpoint_dialect(
                database_code)
        else:
            db_dialect = update_options.dialect

        request_body = _add_plugin_options(
            request_body, db_dialect, update_options.flow_name, update_options.changelog_filepath)

    request_url = f"/alpdb/{db_dialect}/database/{database_code}/data-model/{data_model}?schema={schema_name}"

    await _run_db_svc_shell_command(request_type, request_url, request_body)


def _add_plugin_options(request_body, dialect: str, flow_name: str, changelog_filepath: str):
    cwd = os.getcwd()
    request_body["customClasspath"] = f'{cwd}/{flow_name}/'
    request_body["customChangelogFilepath"] = f'db/migrations/{dialect}/{changelog_filepath}'
    return request_body
