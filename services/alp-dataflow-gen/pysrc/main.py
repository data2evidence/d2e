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
    json_graph = {"nodes":{"cohort_definition_set_node_0":{"id":"e441d143-2ef0-4171-9036-682b2ee22b05","type":"cohort_definition_set_node"},"cohort_generator_node_0":{"incremental":True,"generateStats":True,"id":"e7f0cc83-e51d-4cd4-b806-3d06281b8c30","type":"cohort_generator_node"},"cohort_diagnostic_node_0":{"incremental":False,"runTimeSeries":False,"runIncidenceRate":True,"runVisistContext":True,"runOrphanConcepts":True,"runCohortRelationship":True,"runInclusionStatistics":True,"runBreakdownIndexEvents":True,"runIncludedSourceConcepts":True,"runTemporalCohortCharacterization":True,"id":"47c220dc-bd7e-4dfd-88f4-bd701acbe9e0","type":"cohort_diagnostic_node"},"cohort_incidence_node_0":{"cohortRefs":[{"id":"1","name":"Celecoxib","description":""},{"id":"2","name":"Diclofenac","description":""},{"id":"4","name":"Celecoxib Age >= 30","description":""},{"id":"5","name":"Diclofenac Age >= 30","description":""}],"strataSettings":{"byYear":True,"byGender":True},"incidenceAnalysis":{"tars":["1","2"],"targets":["1","2","4","5"],"outcomes":["1"]},"id":"88844642-71a0-4d7a-a4d0-e2e19286c788","type":"cohort_incidence_node"},"cohort_incidence_target_cohorts_node_0":{"defId":1,"defName":"GI bleed","cohortId":3,"cleanWindow":9999,"id":"89cb49be-5e7c-4325-9218-262e6c02c6ab","type":"cohort_incidence_target_cohorts_node"},"time_at_risk_node_0":{"id":"1","endWith":"start","endOffset":"365","startWith":"start","startOffset":0,"type":"time_at_risk_node"},"default_covariate_settings_node_0":{"includedCovariateIds":[],"addDescendantsToExclude":False,"addDescendantsToInclude":False,"excludedCovariateConceptIds":[],"includedCovariateConceptIds":[],"id":"45745fd9-e505-466c-b33c-1d0a244b7595","type":"default_covariate_settings_node"},"negativeControlOutcomes":{"trueEffectSize":1,"ncoCohortSetIds":[],"outcomeOfInterest":False,"priorOutcomeLookback":30,"id":"7132d9b4-1bff-49cd-a425-0c951c0d51fd","type":"outcomes_node"},"nco_cohort_set_node_0":{"id":"2fac5344-e8cb-4d8a-b16b-2040d2b677f5","type":"nco_cohort_set_node"},"characterization_node_0":{"targetIds":["1","2"],"outcomeIds":["3"],"timeAtRiskConfigs":[{"endAnchor":"cohort end","startAnchor":"cohort start","riskWindowEnd":0,"riskWindowStart":1},{"endAnchor":"cohort end","startAnchor":"cohort start","riskWindowEnd":365,"riskWindowStart":1}],"minPriorObservation":0,"dechallengeStopInterval":"30","dechallengeEvaluationWindow":"30","id":"e34f178c-f098-4322-8ff9-e0436ca68cf3","type":"characterization_node"},"tcos1":{"targetId":1,"comparatorId":"2","excludedCovariateConceptIds":["1118084","1124300"],"includedCovariateConceptIds":[],"id":"fb1fab05-ffe8-4c57-b432-db2d7e526321","type":"target_comparator_outcomes_node"},"cmAnalysis1":{"psArgs":{"control":True,"stopOnError":False,"cvRepetition":1},"analysisId":"1","fitOutcomeModelArgs":{"modelType":"cox"},"dbCohortMethodDataArgs":{"maxCohortSize":100000,"washoutPeriod":183,"firstExposureOnly":True,"removeDuplicateSubjects":"remove all"},"id":"e18038a5-aadd-4e5c-b328-53e9ad3e0015","type":"cohort_method_analysis_node"},"study_population_settings_node_0":{"sccsArgs":{"minAge":18,"naivePeriod":365},"cohortMethodArgs":{"endAnchor":"cohort end","startAnchor":"cohort start","minDaysAtRisk":1,"riskWindowEnd":30,"riskWindowStart":0},"patientLevelPredictionArgs":{"endAnchor":"cohort end","startAnchor":"cohort start","minTimeAtRisk":1,"riskWindowEnd":365,"riskWindowStart":1},"id":"2a049ce5-6b9c-4e11-b92e-4e64d4a7bc7c","type":"study_population_settings_node"},"self_controlled_case_series_analysis_node_0":{"analysisId": 1, "dbSccsDataArgs":{"studyEndDate":"","studyStartDate":"","nestingCohortId":1,"useNestingCohort":True,"maxCasesPerOutcome":100000,"deleteCovariateSmallCount":0},"fitSccsModelArgs":{"seed":1,"cvType":"auto","control":True,"noiseLevel":"quiet","selectorType":"byPid","startingVariance":0.1,"resetCoefficients":True},"sccsIntervalDataArgs":{"minCasesForTimeCovariates":100000},"id":"8d814dae-fb09-408d-b4e4-415b10e507c5","type":"self_controlled_case_series_analysis_node"},"covarPreExxp":{"end":"-1","label":"Pre-exposure","start":"-30","endAnchor":"era end","stratifyById":False,"excludedEraIds":[],"includedEraIds":["exposureId"],"profileLikelihood":False,"exposureOfInterest":False,"firstOccurenceOnly":False,"allowRegularization":False,"id":"93d90129-89e5-40cb-beb3-b1ac3767503e","type":"era_covariate_settings_node"},"calendar_time_covariate_settings_node_0":{"caldendarTimeKnots":5,"allowRegularization":True,"computeConfidenceIntervals":False,"id":"af04df27-1b14-45a0-bb75-8e7373a2c352","type":"calendar_time_covariate_settings_node"},"seasonality_covariate_settings_node_0":{"seasonalityKnots":5,"allowRegularization":True,"computeConfidenceIntervals":False,"id":"4d854eeb-b848-4b16-a76c-02f3ee812959","type":"seasonality_covariate_settings_node"},"self_controlled_case_series_node_0":{"combineDataFetchAcrossOutcomes":False,"id":"6505129e-ff48-4250-adeb-56b4f8cf7acb","type":"self_controlled_case_series_node"},"patient_level_prediction_node_0":{"id":"9d4b1f8d-49e0-49a2-8066-ba1b24054f27","type":"patient_level_prediction_node"},"time_at_risk_node_1":{"id":"2","endWith":"end","endOffset":0,"startWith":"start","startOffset":0,"type":"time_at_risk_node"},"cohort_method_node_0":{"trueEffectSize":1,"cohortMethodConfigs":[],"priorOutcomeLookback":30,"id":"7c412e30-db37-443f-88f3-a2e0defe16ee","type":"cohort_method_node"},"outcomeOfInterest":{"trueEffectSize":"","ncoCohortSetIds":["3"],"outcomeOfInterest":True,"priorOutcomeLookback":"","id":"3da62e57-3150-4542-afb7-28db50649c5f","type":"outcomes_node"},"tcos2":{"targetId":"4","comparatorId":"5","excludedCovariateConceptIds":["1118084","1124300"],"includedCovariateConceptIds":[],"id":"bd6b1c42-4d61-4237-bf75-d248a751c878","type":"target_comparator_outcomes_node"},"cmAnalysis2":{"psArgs":{"control":True,"stopOnError":False,"cvRepetition":1},"analysisId":"2","fitOutcomeModelArgs":{"modelType":"cox"},"dbCohortMethodDataArgs":{"maxCohortSize":100000,"washoutPeriod":183,"firstExposureOnly":True,"removeDuplicateSubjects":"remove all"},"id":"4a1be3bb-dbb6-4da0-95d7-1afa00c1e6e7","type":"cohort_method_analysis_node"},"covarExposureOfInt":{"end":0,"label":"Main","start":0,"endAnchor":"era end","startAnchor":"era start","stratifyById":False,"excludedEraIds":[],"includedEraIds":["exposureId"],"profileLikelihood":True,"exposureOfInterest":True,"firstOccurenceOnly":False,"allowRegularization":False,"id":"8f055580-8128-4aab-9c98-ce96584352bc","type":"era_covariate_settings_node"},"study_population_settings_node_1":{"sccsArgs":{"minAge":18,"naivePeriod":365},"cohortMethodArgs":{"endAnchor":"cohort end","startAnchor":"cohort start","minDaysAtRisk":1,"riskWindowEnd":30,"riskWindowStart":0},"patientLevelPredictionArgs":{"endAnchor":"cohort start","startAnchor":"cohort start","minTimeAtRisk":1,"riskWindowEnd":365,"riskWindowStart":1},"id":"de75e9e7-b2e3-45a6-adbb-1649d6b58850","type":"study_population_settings_node"},"exposure_node_0":{"outcomeOfInterestIds":[],"exposureOfInterestIds":[],"id":"fd3570d9-8aa9-4014-8dd5-714759e22993","type":"exposure_node"},"negative_control_outcome_cohort_node_0":{"occurenceType":"all","detectOnDescendants":True,"id":"0d823aed-3fb8-4b1a-a5b3-11f6e23a6ade","type":"negative_control_outcome_cohort_node"},"strategus_node_0":{"id":"0d823aed-3fb8-4b1a-a5b3-11f6e23a6ade","type":"strategus_node"}},"edges":{"e1":{"source":"cohort_incidence_target_cohorts_node_0","target":"cohort_incidence_node_0"},"e2":{"source":"time_at_risk_node_0","target":"cohort_incidence_node_0"},"e3":{"source":"time_at_risk_node_0","target":"default_covariate_settings_node_0"},"e4":{"source":"negativeControlOutcomes","target":"default_covariate_settings_node_0"},"e5":{"source":"nco_cohort_set_node_0","target":"default_covariate_settings_node_0"},"e6":{"source":"default_covariate_settings_node_0","target":"characterization_node_0"},"e7":{"source":"negativeControlOutcomes","target":"tcos1"},"e8":{"source":"default_covariate_settings_node_0","target":"cmAnalysis1"},"e9":{"source":"study_population_settings_node_0","target":"cmAnalysis1"},"e10":{"source":"study_population_settings_node_0","target":"self_controlled_case_series_analysis_node_0"},"e11":{"source":"covarPreExxp","target":"self_controlled_case_series_analysis_node_0"},"e12":{"source":"calendar_time_covariate_settings_node_0","target":"self_controlled_case_series_analysis_node_0"},"e13":{"source":"seasonality_covariate_settings_node_0","target":"self_controlled_case_series_analysis_node_0"},"e14":{"source":"self_controlled_case_series_analysis_node_0","target":"self_controlled_case_series_node_0"},"e15":{"source":"time_at_risk_node_1","target":"cohort_incidence_node_0"},"e16":{"source":"cmAnalysis1","target":"cohort_method_node_0"},"e17":{"source":"tcos1","target":"cohort_method_node_0"},"e18":{"source":"outcomeOfInterest","target":"default_covariate_settings_node_0"},"e19":{"source":"study_population_settings_node_0","target":"cmAnalysis2"},"e20":{"source":"cmAnalysis2","target":"cohort_method_node_0"},"e21":{"source":"tcos2","target":"cohort_method_node_0"},"e22":{"source":"negativeControlOutcomes","target":"tcos2"},"e23":{"source":"outcomeOfInterest","target":"tcos1"},"e24":{"source":"outcomeOfInterest","target":"tcos2"},"e25":{"source":"covarExposureOfInt","target":"self_controlled_case_series_analysis_node_0"},"e26":{"source":"study_population_settings_node_1","target":"patient_level_prediction_node_0"},"e27":{"source":"exposure_node_0","target":"self_controlled_case_series_node_0"},"e28":{"source":"exposure_node_0","target":"patient_level_prediction_node_0"},"e29":{"source":"patient_level_prediction_node_0","target":"strategus_node_0"},"e30":{"source":"self_controlled_case_series_node_0","target":"strategus_node_0"},"e31":{"source":"cohort_incidence_node_0","target":"strategus_node_0"},"e32":{"source":"cohort_diagnostic_node_0","target":"strategus_node_0"},"e33":{"source":"cohort_generator_node_0","target":"strategus_node_0"},"e34":{"source":"characterization_node_0","target":"strategus_node_0"},"e35":{"source":"cohort_method_node_0","target":"strategus_node_0"},"e36":{"source":"negative_control_outcome_cohort_node_0","target":"strategus_node_0"},"e37":{"source":"cohort_definition_set_node_0","target":"strategus_node_0"}}}
    options = {"trace_config":{"trace_mode":False,"trace_db":"alp"},"test_mode":False}
    execute_dataflow_flow(json_graph, options)