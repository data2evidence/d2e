export interface IPrefectFlowRunDto {
  id: string;
  parameters: {
    options: {
      releaseId: string;
      cohortDefinitionId: string;
    };
  };
}

export interface IDataQualityResult {
  Overview: {
    countOverallFailed: number;
    countFailedPlausibility: number;
    countFailedConformance: number;
    countFailedCompleteness: number;
  };
  Metadata: {
    cdmReleaseDate: string;
  };
  CheckResults: IDataQualityCheckResult[];
}

export interface IDataQualityCheckResult {
  numViolatedRows?: number;
  pctViolatedRows?: number;
  numDenominatorRows?: number;
  executionTime?: string;
  queryText: string;
  checkName: string;
  checkLevel: string;
  checkDescription: string;
  cdmTableName: string;
  cdmFieldName?: string;
  sqlFile: string;
  category: string;
  subcategory?: string;
  context: string;
  checkId: string;
  failed: number;
  passed: number;
  thresholdValue?: number;
  notesValue?: string;
  conceptId?: string;
  unitConceptId?: string;
  notApplicable?: number;
  isError?: number;
  error?: string;
}

export interface IDataCharacterizationResult {
  exportToAres: {
    cdmReleaseDate: string;
    "records-by-domain": { domain: string; countRecords: number }[];
  };
}

export interface IDomainContinuityResult {
  domain: string;
  records: {
    cdmReleaseDate: string;
    count: number;
  }[];
}

export interface IDqdResultDto {
  flowRunId?: string;
  flowRunIds?: string[];
}

export interface CohortSurvivalFlowRunDto {
  options: CohortSurvivalFlowRunOptions;
}

interface CohortSurvivalFlowRunOptions {
  databaseCode: string;
  schemaName: string;
  datasetId: string;
  targetCohortDefinitionId: number;
  outcomeCohortDefinitionId: number;
}

export interface CohortGeneratorFlowRunDto {
  options: CohortGeneratorFlowRunOptions;
}

interface CohortGeneratorFlowRunOptions {
  databaseCode: string;
  schemaName: string;
  stringvocabSchemaName: string;
  cohortJson: CohortJson;
  datasetId: string;
  description: string;
  owner: string;
  token: string;
}
interface CohortJson {
  id: number;
  name: string;
  createdDate: number;
  modifiedDate: number;
  hasWriteAccess: boolean;
  tags: string[];
  expressionType: object;
}

export interface DBSvcFlowRunDto {
  dbSvcOperation: string;
  requestType: string;
  requestUrl: string;
  requestBody?: object; // Optional property
}

export interface DatasetAttributesFlowRunDto {
  token: string;
  versionInfo: object;
  datasetSchemaMapping: any[];
}

export interface MeilisearchAddIndexFlowRunDto {
  databaseCode: string;
  vocabSchemaName: string;
  tableName: string;
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
export interface ICreateDqdFlowRunDto {
  datasetId: string;
  comment?: string;
  vocabSchemaName?: string;
}
export interface DataModel {
  flowName: string;
  datamodel: string;
  flowId: string;
}

export interface PluginFlow {
  name: string;
  tags: string[];
  type: string;
  volumes?: string[];
  datamodels: string[];
  entrypoint: string;
  parameter_openapi_schema: object;
}

export interface IGetVersionInfoFlowRunDto {
  flowRunName: string;
  options: object;
}

export interface IFlowRunQueryDto {
  startDate?: Date;
  endDate?: Date;
  states?: FlowRunState[];
  tags?: string[];
  flowIds?: string[];
  deploymentIds?: string[];
  deploymentNames?: string[];
  workPools?: string[];
}

export interface DataCharacterizationOptions {
  comment: string;
  datasetId: string;
  releaseId: string;
  schemaName: string;
  releaseDate: string;
  databaseCode: string;
  resultsSchema: string;
  vocabSchemaName: string;
  cdmVersionNumber: string;
}

export interface DataCharacterizationFlowRunDto {
  datasetId: string;
  comment?: string;
  releaseId?: string;
  excludeAnalysisIds?: string;
}
