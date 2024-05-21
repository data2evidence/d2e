from prefect import flow
from prefect.task_runners import SequentialTaskRunner
from flows.dataflow.flow import exec_flow as execute_dataflow
from flows.alp_db_svc.flow import run_alp_db_svc, run_seed_postgres
from flows.meilisearch.flow import execute_add_index_flow, execute_add_index_with_embeddings_flow
from flows.strategus.flow import execute_strategus
from flows.portal_server.flow import update_dataset_attributes
from utils.types import (
    AlpDBSvcOptionsType,
    datasetAttributesType
)


@flow(log_prints=True)
def execute_dataflow_flow(json_graph, options):
    execute_dataflow(json_graph, options)


@flow(log_prints=True, task_runner=SequentialTaskRunner)
def execute_alp_db_svc_flow(options: AlpDBSvcOptionsType):
    run_alp_db_svc(options)


@flow(log_prints=True, task_runner=SequentialTaskRunner)
def execute_seed_postgres_data_flow(database_code, vocab_schema_name, cdm_schema_name):
    run_seed_postgres(database_code, vocab_schema_name, cdm_schema_name)


@flow(log_prints=True, task_runner=SequentialTaskRunner)
def execute_strategus_flow(analysis_spec, options):
    execute_strategus(analysis_spec, options)


@flow(log_prints=True, task_runner=SequentialTaskRunner)
def update_dataset_attributes_flow(options: datasetAttributesType):
    update_dataset_attributes(options)
