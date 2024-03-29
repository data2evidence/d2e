export const query = {
  GET_STUDY: `query($id: String!) {
        study(id: $id) {
          id
          schemaName
          type
          tokenStudyCode
          databaseName
          studyDetail {
            id
            name
            description
          }
          tenant {
            id
            name
          }
        }
      }`,
  GET_STUDIES_AS_SYSTEM_ADMIN: `query {
        studiesAsSystemAdmin {
          id
          type
          tokenStudyCode
          schemaName
          visibilityStatus
          dataModel
          databaseName
          studyDetail {
            id
            name
            description
            summary
            showRequestAccess
          }
          studyDashboards {
            id
            name
            url
          }
          studyAttribute {
            name
            value
            dataType
          }
          studyTags {
            id
            name
          }
          tenant {
            id
            name
          }
          studySystem {
            id
            name
          }
        }
      }`,
  GET_STUDIES: `query {
        studies {
          id
          databaseName
          schemaName
          tokenStudyCode
          studyDetail {
            id
            name
            description
            summary
            showRequestAccess
          }
          studyDashboards {
            id
            name
            url
          }
          studyAttribute {
            id
            name
            value
          }
          studyTags {
            id
            name
          }
          tenant {
            id
            name
          }
        }
      }`,
  CREATE_STUDY: `mutation ($datasetDto: NewStudyInput!) {
    createStudy(newStudyInput: $datasetDto) {
      id
      tenantId
      type
      tokenStudyCode
      databaseName
    }
  }`,
  CREATE_HANA_RELEASE: `mutation ($input: CreateHanaReleaseInput!){
    createHanaRelease(CreateHanaReleaseInput: $input){
      name
      releaseDate
      studyId
    }
  }`,
  OFFBOARD_STUDY: `mutation ($input: OffboardStudyInput!) {
    offboardStudy(offboardStudyInput: $input) {
      code
      success
      id
    }
  }`,
  COPY_STUDY: `mutation ($datasetDto: CopyStudyInput!) {
    copyStudy(copyStudyInput: $datasetDto) {
      tenantId
      type
      tokenStudyCode
      databaseName
      schemaName
    }
  }`,
  CREATE_STUDY_DETAIL: `mutation ($datasetDetailDto: NewStudyDetailInput!) {
    createStudyDetail(newStudyDetailInput: $datasetDetailDto) {
      id
    }
  }`,
  UPDATE_STUDY_DETAIL: `mutation ($datasetDetailDto: UpdateStudyDetailInput!) {
    updateStudyDetail(updateStudyDetailInput: $datasetDetailDto) {
      studyId
    }
  }`,
  UPDATE_STUDY_METADATA: `mutation ($datasetMetadataDto: UpdateStudyMetadataInput!) {
    updateStudyMetadata(updateStudyMetadataInput: $datasetMetadataDto)
  }`,
  GET_SYSTEM_FEATURES: `query ($systemNameDto: GetSystemAllFeaturesInput!) {
    getSystemAllFeatures(systemAllFeaturesInput: $systemNameDto) {
      feature
      systemName
      enabled
    }
  }`
}

export const QueryType = {
  GET_STUDY: 'GET_STUDY',
  GET_STUDIES_AS_SYSTEM_ADMIN: 'GET_STUDIES_AS_SYSTEM_ADMIN',
  GET_STUDIES: 'GET_STUDIES',
  CREATE_STUDY: 'CREATE_STUDY',
  OFFBOARD_STUDY: 'OFFBOARD_STUDY',
  COPY_STUDY: 'COPY_STUDY',
  CREATE_STUDY_DETAIL: 'CREATE_STUDY_DETAIL',
  UPDATE_STUDY_DETAIL: 'UPDATE_STUDY_DETAIL',
  UPDATE_STUDY_METADATA: 'UPDATE_STUDY_METADATA',
  GET_SYSTEM_FEATURES: 'GET_SYSTEM_FEATURES',
  CREATE_HANA_RELEASE: 'CREATE_HANA_RELEASE'
}

export const QueryAction = {
  [QueryType.GET_STUDY]: 'getting study',
  [QueryType.GET_STUDIES_AS_SYSTEM_ADMIN]: 'getting study as system admin',
  [QueryType.GET_STUDIES]: 'getting studies',
  [QueryType.CREATE_STUDY]: 'creating study',
  [QueryType.OFFBOARD_STUDY]: 'offboarding study',
  [QueryType.COPY_STUDY]: 'copying study',
  [QueryType.CREATE_STUDY_DETAIL]: 'creating study detail',
  [QueryType.UPDATE_STUDY_DETAIL]: 'updating study detail',
  [QueryType.UPDATE_STUDY_METADATA]: 'updating study attribute',
  [QueryType.GET_SYSTEM_FEATURES]: 'getting system features',
  [QueryType.CREATE_HANA_RELEASE]: 'creating hana release'
}
