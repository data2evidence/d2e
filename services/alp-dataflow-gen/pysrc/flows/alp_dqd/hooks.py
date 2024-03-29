import json
from prefect.server.schemas.states import StateType
from utils.databaseConnectionUtils import insert_to_dqd_result_table

async def persist_dqd(task, task_run, state, output_folder, schema_name): 
    error_message = None
    result_json = {}
    isError = state.type == StateType.FAILED
    if isError:
        with open(f'{output_folder}/errors/{schema_name}.json', 'rt') as f:
            error_message = f.read()
    else:
        with open(f'{output_folder}/{schema_name}.json', 'rt') as f:
            result_json = json.loads(f.read())
    await insert_to_dqd_result_table(flow_run_id=task_run.flow_run_id, result=result_json, error=isError, error_message=error_message)
