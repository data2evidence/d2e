from prefect import flow, task, get_run_logger
from utils.types import PG_TENANT_USERS, AlpDBSvcOptionsType
from dao.DBDao import DBDao
import importlib

def run_alp_db_svc(options: AlpDBSvcOptionsType):
    request_type = options.requestType
    request_url = options.requestUrl
    request_body = options.requestBody if options.requestBody else {}
    try:
        run_command(request_type, request_url, request_body)
    except Exception as e:
        get_run_logger().error(f"{e}")


def run_seed_postgres(database_code: str, vocab_schema_name: str, cdm_schema_name: str):
    vocab_schema_exists = create_schema_flow(database_code, vocab_schema_name, vocab_schema_name)
    if vocab_schema_exists:
        cdmdefault_schema_exists = create_schema_flow(database_code, cdm_schema_name, vocab_schema_name)
        if cdmdefault_schema_exists:
            load_data_flow(database_code, cdm_schema_name)
    create_schema_flow(database_code, 'fhir_data', vocab_schema=None)


@task
async def run_command(request_type: str, request_url: str, request_body):
    logger = get_run_logger()
    try:
        dbsvc_module = importlib.import_module('d2e_dbsvc')
        await dbsvc_module._run_db_svc_shell_command(request_type, request_url, request_body)
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
                    request_body={"cleansedSchemaOption": False, "vocabSchema": vocab_schema}
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
    # currently only supports pg dialect
    return schema_obj.check_schema_exists()
