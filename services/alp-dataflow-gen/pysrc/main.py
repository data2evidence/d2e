from prefect import flow
from prefect.task_runners import SequentialTaskRunner
from flows.dataflow.flow import exec_flow as execute_dataflow


@flow(log_prints=True)
def execute_dataflow_flow(json_graph, options):
    execute_dataflow(json_graph, options)