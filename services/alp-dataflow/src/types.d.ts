export interface ITestDataflowDto {
  dataflow: IReactFlow
}

export interface IDataflowDto {
  id?: string
  name: string
  dataflow: IDataflowRevisionDto
}

export interface IReactFlow {
  nodes: IReactFlowNode[]
  edges: IReactFlowEdge[]
}

export interface IDataflowRevisionDto extends IReactFlow {
  comment?: string
}

export interface IDataflowDuplicateDto {
  name: string
}

interface IReactFlowNode {
  id: string
  type: string
  data: IFlowBasicNodeData | IFlowCsvNodeData
  position: {
    x: number
    y: number
  }
  sourcePosition: string
  targetPosition: string
  dragHandle: string
  width: number
  height: number
  parentNode?: string
}

interface IFlowBasicNodeData {
  name: string
  description: string
  executorOptions?: IPrefectExecutorOptions
}

interface IFlowCsvNodeData extends IFlowBasicNodeData {
  hasheader: string
}

interface IReactFlowEdge {
  id: string
  source: string
  target: string
}

export interface IPrefectParameters {
  json_graph: {
    edges: IPrefectEdge
    nodes: object
  }
  options: IPrefectOptions
}

interface IPrefectOptions {
  trace_config: IPrefectTraceConfig
  test_mode: boolean
}

interface IPrefectTraceConfig {
  trace_mode: boolean
  trace_db: string
}

interface IPrefectExecutorOptions {
  executor_type: string
  executor_address: IPrefectExecutorAddress
}

interface IPrefectExecutorAddress {
  host: string
  port: string
  ssl: boolean
}

interface IPrefectEdge {
  source?: string
  target: string
}

export interface IPrefectTaskResult {
  result: object
}

export interface IPrefectAdhocFlowDto {
  flowName?: string
  url?: string
}

export interface IPrefectFlowRunByDeploymentDto {
  flowRunName: string
  flowName: string
  deploymentName: string
  params: object
}

export interface IPrefectFlowRunByMetadataDto {
  type: string
  flowRunName: string
  flowId?: string
  options?: object
}

export interface IDataQualityResult {
  Overview: {
    countOverallFailed: number
    countFailedPlausibility: number
    countFailedConformance: number
    countFailedCompleteness: number
  }
  Metadata: {
    cdmReleaseDate: string
  }
  CheckResults: IDataQualityCheckResult[]
}

export interface IDataCharacterizationResult {
  exportToAres: {
    cdmReleaseDate: string
    'records-by-domain': { domain: string; countRecords: number }[]
  }
}

export interface IDomainContinuityResult {
  domain: string
  records: {
    cdmReleaseDate: string
    count: number
  }[]
}

export interface IDataQualityCheckResult {
  numViolatedRows?: number
  pctViolatedRows?: number
  numDenominatorRows?: number
  executionTime?: string
  queryText: string
  checkName: string
  checkLevel: string
  checkDescription: string
  cdmTableName: string
  cdmFieldName?: string
  sqlFile: string
  category: string
  subcategory?: string
  context: string
  checkId: string
  failed: number
  passed: number
  thresholdValue?: number
  notesValue?: string
  conceptId?: string
  unitConceptId?: string
  notApplicable?: number
  isError?: number
  error?: string
}

export interface IDqdResultDto {
  flowRunId?: string
  flowRunIds?: string[]
}

export interface IPrefectFlowDto {
  id?: string
  name: string
}

export interface IPrefectFlowRunDto {
  id: string
  parameters: {
    options: {
      releaseId: string
      cohortDefinitionId: string
    }
  }
}

export interface IHistoryJob {
  flowRunId: string
  flowRunName: string
  schemaName: string
  dataCharacterizationSchema: string
  cohortDefinitionId: string
  type: string
  createdAt: string
  completedAt: string
  status: string
  error: string | null
  datasetId: string | null
  comment: string | null
  databaseCode: string
}

export interface IFlowMetadataDto {
  flowId?: string
  name: string
  type: string
  entrypoint: string
  url?: string
  datamodels?: string[]
  others?: JSON
}
