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
