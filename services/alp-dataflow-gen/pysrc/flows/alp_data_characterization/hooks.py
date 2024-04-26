import os
import pandas as pd
from prefect.logging.loggers import flow_run_logger, task_run_logger
from prefect.server.schemas.states import StateType
from utils.databaseConnectionUtils import insert_to_dqd_result_table
from utils.types import dcOptionsType
from alpconnection.dbutils import get_db_svc_endpoint_dialect
import importlib


async def drop_data_characterization_schema(flow, flow_run, state):
    logger = flow_run_logger(flow_run, flow)
    options = dcOptionsType(**flow_run.parameters['options'])
    databaseCode = options.databaseCode
    resultsSchema = options.resultsSchema

    try:
        databaseDialect = get_db_svc_endpoint_dialect(databaseCode)
        request_url = f"/alpdb/{databaseDialect}/dataCharacterization/database/{databaseCode}/schema/{resultsSchema}"
        dbsvc_module = importlib.import_module('d2e_dbsvc')
        await dbsvc_module._run_db_svc_shell_command("delete", request_url, {})
    except Exception as e:
        logger.error(e)
        raise e


async def persist_data_characterization(task, task_run, state, output_folder):
    logger = task_run_logger(task_run, task)
    error_message = None
    result_json = {}
    is_error = state.type == StateType.FAILED
    if is_error:
        is_error = True
        with open(f'{output_folder}/errorReportR.txt', 'rt') as f:
            error_message = f.read()
        logger.error(error_message)
    else:
        # Data_characterization run does not need to insert data into table on completion
        return
    await insert_to_dqd_result_table(
        flow_run_id=task_run.flow_run_id,
        result=result_json,
        error=is_error,
        error_message=error_message
    )


async def persist_export_to_ares(task, task_run, state, output_folder, schema_name):
    logger = task_run_logger(task_run, task)
    error_message = None
    result_json = {}
    is_error = state.type == StateType.FAILED
    if is_error:
        error_message = await get_export_to_ares_execute_error_message_from_file(output_folder, schema_name)
        logger.error(error_message)
    else:
        result_json = await get_export_to_ares_results_from_file(output_folder, schema_name)
    await insert_to_dqd_result_table(flow_run_id=task_run.flow_run_id, result=result_json, error=is_error, error_message=error_message)


async def get_export_to_ares_execute_error_message_from_file(outputFolder: str, schema_name):
    ares_path = os.path.join(outputFolder, schema_name)
    # Get name of folder created by at {outputFolder/schema_name}

    cdm_release_date = os.listdir(ares_path)[0]
    with open(os.path.join(ares_path, cdm_release_date, "errorReportSql.txt"), 'rt') as f:
        error_message = f.read()
    return error_message


async def get_export_to_ares_results_from_file(outputFolder: str, schema_name):
    ares_path = os.path.join(outputFolder, schema_name)
    # Get name of folder created by at {outputFolder/schema_name}

    cdm_release_date = os.listdir(ares_path)[0]

    # export_to_ares creates many csv files, but now we are only interested in saving results from records-by-domain.csv
    # Read records-by-domain.csv and parse csv into json
    file_name = "records-by-domain"
    df = pd.read_csv(os.path.join(
        ares_path, cdm_release_date, f"{file_name}.csv"))
    df = df.rename(columns={"count_records": "countRecords"})

    data = {
        "exportToAres": {
            "cdmReleaseDate": cdm_release_date,
            file_name: df.to_dict(orient="records")
        }
    }

    return data
