export const PrefectTagNames = {
  DQD: ["data_quality_dashboard"],
  DATA_CHARACTERIZATION: ["data_characterization"],
  DB_SVC: ["alp_db_svc"],
};

export const DATA_QUALITY_DOMAINS = [
  "CONDITION_ERA",
  "CONDITION_OCCURRENCE",
  "PROCEDURE_OCCURRENCE",
  "DEATH",
  "MEASUREMENT",
  "DRUG_ERA",
  "DRUG_EXPOSURE",
  "PERSON",
  "OBSERVATION",
  "DEVICE",
  "VISIT_OCCURRENCE",
];

export enum PrefectDeploymentName {
  DQD = "alp_dqd",
  DATA_CHARACTERIZATION = "alp_data_characterization",
  COHORT = "cohort_generator",
  DB_SVC = "alp-db-svc",
  MEILISEARCH_ADD_INDEX = "add_search_index",
  DATASET_ATTRIBUTE = "update-dataset-attributes",
  FETCH_VERSION_INFO = "fetch-version-info",
  COHORT_SURVIVAL = "cohort-survival-plugin_deployment",
}

export enum PrefectFlowName {
  DQD = "execute-dqd",
  DATA_CHARACTERIZATION = "execute-data-characterization",
  COHORT = "execute-cohort-generator-flow",
  DB_SVC = "execute-alp-db-svc-flow",
  MEILISEARCH_ADD_INDEX = "execute-add-search-index-flow",
  DATASET_ATTRIBUTE = "update-dataset-attributes-flow",
  FETCH_VERSION_INFO = "fetch-version-info-flow",
  COHORT_SURVIVAL = "cohort-survival-plugin",
}

export enum FLOW_RUN_STATE_TYPES {
  "COMPLETED" = "COMPLETED",
  "SCHEDULED" = "SCHEDULED",
  "PENDING" = "PENDING",
  "RUNNING" = "RUNNING",
  "PAUSED" = "PAUSED",
  "CANCELLING" = "CANCELLING",
  "CANCELLED" = "CANCELLED",
  "FAILED" = "FAILED",
  "CRASHED" = "CRASHED",
}

export enum FlowRunState {
  SCHEDULED = "Scheduled",
  LATE = "Late",
  RESUMING = "Resuming",
  AWAITING_RETRY = "AwaitingRetry",
  PENDING = "Pending",
  PAUSED = "Paused",
  RUNNING = "Running",
  RETRYING = "Retrying",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  CANCELLING = "Cancelling",
  CRASHED = "Crashed",
  FAILED = "Failed",
  TIMED_OUT = "TimedOut",
}
