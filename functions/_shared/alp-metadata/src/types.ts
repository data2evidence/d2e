export type Study = {
  id: string
  studyId: string
  tokenStudyCode: string
  name: string
  schemaName: string
  databaseName: string
}

export type StudyName = {
  id: string
  tokenStudyCode: string
  schemaName: string
  studyDetail: {
    name: string
  }
}

export type ConfigType = {
  alpTenantId: string
  appId: string
  appSecret: string
  alpMetadataScope: string
  graphqlEndpoint: string
}

export type UserConfigType = {
  graphqlEndpoint: string
}

export type StudyMetadata = {
  name: string
  dataType: string
  value: string
}

export type StudyWithMetadata = {
  id: string
  studyMetadata: StudyMetadata[]
}
