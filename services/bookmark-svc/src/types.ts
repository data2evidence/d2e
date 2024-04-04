/**
 * this file should have all the types in this repo
 */
import { Connection } from '@alp/alp-base-utils'
import ConnectionInterface = Connection.ConnectionInterface
import { Request } from 'express'

export interface IMRIRequest extends Request {
  dbConnections: {
    analyticsConnection: ConnectionInterface
    vocabConnection: ConnectionInterface
    configConnection: ConnectionInterface
  }
  studiesDbMetadata: {
    studies: any
    cachedAt: number
  }
  fileName?: string
}
export interface Map<T> {
  [key: string]: T
}

export type Partial<T> = {
  [P in keyof T]?: T[P]
}

export type PlaceholderType = {
  patient: string
  interaction: string
  code: string
  intMeasure: string
  related: string
  observation: string
  refCodes: string
  patientdata: string
  text: string
}

export type ConfigMetaType = {
  configId: string
  configVersion: string
  configStatus: string
  configName: string
  dependentConfig: {
    configId: string
    configVersion: string
  }
  creator: string
  created: string
  modifier: string
  modified: string
}

export type ConfigErrorType = {
  config: any
  definition: string
  path: string
}

export type FilterExprType = {
  filterKey: string
  filterValue: string
  op: string
  attrPath?: string
  fhirAnnotation?: string
}

export type FilterType = {
  and: FilterExprType[]
  or: FilterExprType[]
}

export type HPHConfigMetaType = {
  meta: any
  config: any
  extensions?: any
}

export type ConfigDefaultsType = {
  INTERACTION_TYPE: string
  ATTRIBUTE: string
  ORIGIN: string
  DATATYPE: string
}

export type AssignedConfigType = {
  assignmentId: string
  assignmentName: string
  configId: string
  configVersion: string
  configStatus: string
  configName: string
  dependentConfig: {
    configId: string
    configVersion: string
  }
  config: Map<string>
}

export type MRIEndpointResultCategoryType = {
  axis: number
  id: string
  name: string
  order: string //"ASC" | "DESC";
  type: string
  value: string
}

export type MRIEndpointResultMeasureType = {
  group: number
  id: string
  name: string
  type: string
  value: string
}

export type MRIEndpointResultType = {
  sql: string
  data: any[]
  measures?: MRIEndpointResultMeasureType[]
  categories?: MRIEndpointResultCategoryType[]
  totalPatientCount?: number
  debug?: any
  noDataReason?: string
  messageKey?: string
  messageLevel?: 'Warning' | 'Error'
  logId?: string
  kaplanMeierStatistics?: any
}

export type PluginEndpointResultType = {
  sql: string
  data: any[]
  totalPatientCount?: number
  debug?: any
  noDataReason?: string
}
export type ScoreType = {
  alpID: string
  personID: string
  score: string
  level: string
  isTestAccount: boolean
}
export type ScoresEndpointResultType = ScoreType[]

export type PluginEndpointStreamResultType = {
  entity: string
  data: NodeJS.ReadableStream
  debug?: any
  noDataReason?: string
}

export type CohortDefinitionType = {
  axes: any[]
  cards: any
  limit: number
  offset: number
  configData: {
    configId: string
    configVersion: string
  }
  columns?: PluginColumnType[]
}

export type PluginColumnType = {
  configPath: string
  seq: number
  order: string
}

export type PluginEndpointFormatType = 'csv' | 'json'

export type RecontactPatientListRequestType = {
  name: string
  cohortDefinition: CohortDefinitionType
  selectedStudyEntityValue: string
}

export type PluginEndpointRequestType = {
  cohortDefinition: CohortDefinitionType
  selectedStudyEntityValue: string
}

export type PluginSelectedAttributeType = {
  id: string
  configPath: string
  order: string
  annotations: string
}

export type ExtensionMetadata = {
  metadata: TableauMetadata[]
}

export type TableauMetadata = {
  id: string
  alias: string
  columns: TableauColumnMetadata[]
}

export type TableauColumnMetadata = {
  id: string
  alias: string
  dataType: string
}

export interface QueryEngineType {
  /**
   * @param {string} ifr The IFR Request
   * @returns {Promise<MRIEndpointResultType>}
   */
  start(ifr: string): Promise<MRIEndpointResultType>
  domainservice(ifr: string): Promise<MRIEndpointResultType>
}

export type KMCurvePairType = {
  outerEl: string
  innerEl: string
}

export type ConfigFormatterSettingsType = Map<ConfigFormatterOptionsType>

export type ConfigFormatterOptionsType = {
  restrictToLanguage: boolean
  applyDefaultAttributes: boolean
  includeDisabledElements: boolean
  concatOTSAttributes: boolean
}

export type QueryObjectResultType<T> = {
  data: T
  sql: string
  sqlParameters: any[]
}

export type CDMConfigMetaDataType = {
  id: string
  version: string
}

export type BackendConfigWithCDMConfigMetaDataType = {
  backendConfig: any
  cdmConfigMetaData: CDMConfigMetaDataType
}

export type StudyMriConfigMetaDataType = {
  config: any
  meta: ConfigMetaType
  schemaName: string
}

export interface IBookmark {
  bookmarkname: string
  bookmark: string
  bmkId: string
}

export interface StudyDbMetadata {
  id: string
  schemaName: string
  databaseName: string
}

export interface StudiesDbMetadata {
  studies: StudyDbMetadata[]
  cachedAt: number
}
