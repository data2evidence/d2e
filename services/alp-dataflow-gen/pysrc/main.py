from prefect import flow
from prefect.task_runners import SequentialTaskRunner
from flows.dataflow.flow import exec_flow as execute_dataflow
from flows.alp_db_svc.flow import run_alp_db_svc
from flows.strategus.flow import execute_strategus
from utils.types import (
    AlpDBSvcOptionsType
)


@flow(log_prints=True)
def execute_dataflow_flow(json_graph, options):
    execute_dataflow(json_graph, options)


@flow(log_prints=True, task_runner=SequentialTaskRunner)
def execute_alp_db_svc_flow(options: AlpDBSvcOptionsType):
    run_alp_db_svc(options)
    
    
@flow(log_prints=True, task_runner=SequentialTaskRunner)
def execute_strategus_flow(analysis_spec, options):
    execute_strategus(analysis_spec, options)
