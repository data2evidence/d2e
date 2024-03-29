export enum PrefectDeploymentName {
  DQD = 'alp_dqd',
  DATA_CHARACTERIZATION = 'alp_data_characterization',
  COHORT = 'cohort_generator',
  DB_SVC = 'alp-db-svc',
  MEILISEARCH_ADD_INDEX = 'add_search_index',
  DATASET_ATTRIBUTE = 'update-dataset-attributes',
  FETCH_VERSION_INFO = 'fetch-version-info'
}

export enum PrefectFlowName {
  DQD = 'execute-dqd',
  DATA_CHARACTERIZATION = 'execute-data-characterization',
  COHORT = 'execute-cohort-generator-flow',
  DB_SVC = 'execute-alp-db-svc-flow',
  MEILISEARCH_ADD_INDEX = 'execute-add-search-index-flow',
  DATASET_ATTRIBUTE = 'update-dataset-attributes-flow',
  FETCH_VERSION_INFO = 'fetch-version-info-flow'
}

export const PrefectTagNames = {
  DQD: ['data_quality_dashboard'],
  DATA_CHARACTERIZATION: ['data_characterization'],
  DB_SVC: ['alp_db_svc']
}

export const DATA_QUALITY_DOMAINS = [
  'CONDITION_ERA',
  'CONDITION_OCCURRENCE',
  'PROCEDURE_OCCURRENCE',
  'DEATH',
  'MEASUREMENT',
  'DRUG_ERA',
  'DRUG_EXPOSURE',
  'PERSON',
  'OBSERVATION',
  'DEVICE',
  'VISIT_OCCURRENCE'
]

export enum FLOW_RUN_STATE_TYPES {
  'COMPLETED' = 'COMPLETED',
  'SCHEDULED' = 'SCHEDULED',
  'PENDING' = 'PENDING',
  'RUNNING' = 'RUNNING',
  'PAUSED' = 'PAUSED',
  'CANCELLING' = 'CANCELLING',
  'CANCELLED' = 'CANCELLED',
  'FAILED' = 'FAILED',
  'CRASHED' = 'CRASHED'
}

export const PREFECT_ADHOC_FLOW_FOLDER_PATH = './prefect_python_module'

export const FLOW_METADATA_JSON_FILENAME = 'alp-job.json'

export const FLOW_METADATA_FOLDER_PATH = 'metadata'

export enum FLOW_METADATA {
  'type' = 'type',
  'datamodel' = 'datamodel',
  'datamodels' = 'datamodels',
  'entrypoint' = 'entrypoint',
  'dqd' = 'dqd',
  'name' = 'name'
}

export const PrefectDeploymentPythonFiles = {
  SCRIPT: 'script.py',
  PIP_INSTALL: 'pip_install.py',
  DEPLOYMENT: 'deployment.py'
}
