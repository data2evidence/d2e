from prefect import flow
from prefect.task_runners import SequentialTaskRunner
from flows.alp_dqd.flow import execute_dqd_flow as execute_dqd
from flows.dataflow.flow import exec_flow as execute_dataflow
from flows.alp_data_characterization.flow import execute_data_characterization_flow as execute_data_characterization
from flows.cohort_generator.flow import execute_cohort_generator
from flows.omop_cdm.flow import create_omop_cdm
from flows.alp_data_characterization.hooks import drop_data_characterization_schema
from flows.alp_db_svc.flow import run_alp_db_svc, run_seed_postgres
from flows.meilisearch.flow import execute_add_index_flow
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

if __name__=="__main__":
    json_graph = {"nodes":{"negative_control_outcome_cohort_node_0":{"occurenceType":"all","detectOnDescendants":True,"id":"d9d19497-5074-434c-89fb-d05cde79447a","type":"negative_control_outcome_cohort_node"},"covariate_settings_node_0":{"id":"a8d6c761-a353-4de4-a44c-77217d97c673","type":"covariate_settings_node"},"target_comparator_outcomes_node_0":{"targetId":1,"comparatorId":1,"trueEffectSize":1,"priorOutcomeLookback":30,"excludedCovariateConceptIds":[],"includedCovariateConceptIds":[],"id":"ae230986-df82-4d99-94e5-3c2908062d54","type":"target_comparator_outcomes_node"},"study_population_settings_node_0":{"endAnchor":["cohort end","cohort end"],"startAnchor":["cohort start","cohort start"],"minTimeAtRisk":1,"riskWindowEnd":365,"riskWindowStart":1,"studyPopulationArgs":{"minAge":18,"endAnchor":["cohort end","cohort end"],"naivePeriod":365,"startAnchor":["cohort start","cohort start"],"minDaysAtRisk":1,"riskWindowEnd":30,"riskWindowStart":0},"id":"beacf2e4-8df8-4e44-9686-5462a3fa96af","type":"study_population_settings_node"}},"edges":{"e1":{"source":"time_at_risk_node_0","target":"characterization_node_0"},"e2":{"source":"covariate_settings_node_0","target":"characterization_node_0"},"e3":{"source":"negative_control_outcome_cohort_node_0","target":"target_comparator_outcomes_node_0"},"e5":{"source":"negative_control_outcome_cohort_node_0","target":"self_controlled_case_series_node_0"},"e6":{"source":"time_at_risk_node_1","target":"characterization_node_0"}}}
    options = {"trace_config":{"trace_mode":False,"trace_db":"alp"},"test_mode":False}
    execute_dataflow_flow(json_graph, options)