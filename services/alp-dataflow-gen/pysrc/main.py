from prefect import flow
from prefect.task_runners import SequentialTaskRunner
from flows.alp_dqd.flow import execute_dqd_flow as execute_dqd
from flows.dataflow.flow import exec_flow as execute_dataflow
from flows.alp_data_characterization.flow import execute_data_characterization_flow as execute_data_characterization
from flows.cohort_generator.flow import execute_cohort_generator
from flows.omop_cdm.flow import create_omop_cdm
from flows.alp_data_characterization.hooks import drop_data_characterization_schema
from flows.alp_db_svc.flow import run_alp_db_svc, run_seed_postgres
from flows.meilisearch.flow import execute_add_index_flow, execute_add_embedder_to_index_settings
from flows.strategus.flow import execute_strategus
from flows.portal_server.flow import update_dataset_attributes, fetch_version_info
from utils.types import (
    dqdOptionsType, 
    dcOptionsType, 
    cohortGeneratorOptionsType,
    omopCDMOptionsType, 
    AlpDBSvcOptionsType, 
    meilisearchAddIndexType, 
    datasetAttributesType,
    fetchVersionInfoType
)

@flow(
    log_prints=True,
    persist_result=True,
    task_runner=SequentialTaskRunner
)
def execute_dqd_flow(options: dqdOptionsType):
    try:
        execute_dqd(options)
    except Exception as e:
        raise e


@flow(
    log_prints=True,
    persist_result=True,
    task_runner=SequentialTaskRunner,
    on_failure=[drop_data_characterization_schema],
    on_cancellation=[drop_data_characterization_schema]
)
def execute_data_characterization_flow(options: dcOptionsType):
    try:
        execute_data_characterization(options)
    except Exception as e:
        raise e


@flow(log_prints=True, persist_result=True, task_runner=SequentialTaskRunner)
def execute_cohort_generator_flow(options: cohortGeneratorOptionsType):
    execute_cohort_generator(options)


@flow(log_prints=True)
def execute_dataflow_flow(json_graph, options):
    execute_dataflow(json_graph, options)


@flow(log_prints=True, task_runner=SequentialTaskRunner)
def create_omop_cdm_flow(options: omopCDMOptionsType):
    create_omop_cdm(options)


@flow(log_prints=True, task_runner=SequentialTaskRunner)
def execute_alp_db_svc_flow(options: AlpDBSvcOptionsType):
    run_alp_db_svc(options)


@flow(log_prints=True, task_runner=SequentialTaskRunner)
def execute_seed_postgres_data_flow(database_code, vocab_schema_name, cdm_schema_name):
    run_seed_postgres(database_code, vocab_schema_name, cdm_schema_name)


@flow(log_prints=True, task_runner=SequentialTaskRunner)
def execute_meilisearch_add_index_flow(options: meilisearchAddIndexType):
    execute_add_index_flow(options)

@flow(log_prints=True, task_runner=SequentialTaskRunner)
def execute_strategus_flow(analysis_spec, options):
    execute_strategus(analysis_spec, options)

@flow(log_prints=True, task_runner=SequentialTaskRunner)
def fetch_version_info_flow(options: fetchVersionInfoType):
    fetch_version_info(options)


@flow(log_prints=True, task_runner=SequentialTaskRunner)
def update_dataset_attributes_flow(options: datasetAttributesType):
    update_dataset_attributes(options)

@flow(log_prints=True, task_runner=SequentialTaskRunner)
def execute_meilisearch_add_embedder_to_index(options: meilisearchAddIndexType):
    execute_add_embedder_to_index_settings(options)