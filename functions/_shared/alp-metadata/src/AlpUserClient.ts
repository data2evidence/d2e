import https from 'https'
import fetch from 'node-fetch'
import 'cross-fetch/polyfill'

import { UserConfigType, Study, StudyName, StudyWithMetadata } from './types'

export default class AlpUserClient {
  private config: UserConfigType

  constructor(inputConfig: UserConfigType) {
    this.config = { ...inputConfig }
    if (!this.config.graphqlEndpoint) {
      throw new Error('alp-metadata: Graphql endpoint is not configured')
    }
  }

  async getUserStudies(token: string, studyId?: string): Promise<Study[]> {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized:
          this.config.graphqlEndpoint.startsWith('https://localhost:') ||
          this.config.graphqlEndpoint.startsWith('https://alp-mercury-approuter:') ||
          this.config.graphqlEndpoint.startsWith('https://alp-minerva-gateway-')
            ? false
            : true
      })

      const response = await fetch(this.config.graphqlEndpoint, {
        method: 'POST',
        headers: {
          authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            {
              studies {
                id
                schemaName
              }
            }`
        }),
        agent: httpsAgent
      })

      const responseText = await response.text()

      if (response.status === 200) {
        if (responseText) {
          const { studies }: { studies: Study[] } = await JSON.parse(responseText).data

          if (studyId) {
            return studies.filter((x: Study) => x.id === studyId)
          }
          return studies
        } else {
          return []
        }
      }

      throw responseText
    } catch (err) {
      console.error(JSON.stringify(err))
      return Promise.reject('alp-user-client: Error getting alp studies metadata')
    }
  }

  async getUserStudyNameList(token: string): Promise<StudyName[]> {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized:
          this.config.graphqlEndpoint.startsWith('https://localhost:') ||
          this.config.graphqlEndpoint.startsWith('https://alp-mercury-approuter:') ||
          this.config.graphqlEndpoint.startsWith('https://alp-minerva-gateway-')
            ? false
            : true
      })

      const response = await fetch(this.config.graphqlEndpoint, {
        method: 'POST',
        headers: {
          authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            {
              studies {
                id
                studyDetail {
                  name
                }
              }
            }`
        }),
        agent: httpsAgent
      })

      const responseText = await response.text()

      if (response.status === 200) {
        if (responseText) {
          const data = JSON.parse(responseText).data
          return data.studies
        } else {
          return []
        }
      }

      throw responseText
    } catch (err) {
      console.error(JSON.stringify(err))
      return Promise.reject('alp-user-client: Error getting alp studies name')
    }
  }

  async getPublicStudiesDbMetadata(): Promise<Study[]> {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized:
          this.config.graphqlEndpoint.startsWith('https://localhost:') ||
          this.config.graphqlEndpoint.startsWith('https://alp-mercury-approuter:') ||
          this.config.graphqlEndpoint.startsWith('https://alp-minerva-gateway-')
            ? false
            : true
      })

      const response = await fetch(this.config.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            {
              publicStudies {
                id
                schemaName
                databaseName
                tokenStudyCode
              }
            }`
        }),
        agent: httpsAgent
      })

      const responseText = await response.text()

      if (response.status === 200) {
        if (responseText) {
          const data = JSON.parse(responseText).data
          const studies = data.publicStudies
          return studies
        } else {
          return []
        }
      }

      throw responseText
    } catch (err) {
      console.error(JSON.stringify(err))
      return Promise.reject('alp-user-client: Error getting alp public studies db metadata')
    }
  }

  async getStudiesDbMetadata(token: string): Promise<Study[]> {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized:
          this.config.graphqlEndpoint.startsWith('https://localhost:') ||
          this.config.graphqlEndpoint.startsWith('https://alp-mercury-approuter:') ||
          this.config.graphqlEndpoint.startsWith('https://alp-minerva-gateway-')
            ? false
            : true
      })

      const response = await fetch(this.config.graphqlEndpoint, {
        method: 'POST',
        headers: {
          authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            {
              studies {
                id
                schemaName
                databaseName
                tokenStudyCode
              }
            }`
        }),
        agent: httpsAgent
      })

      const responseText = await response.text()

      if (response.status === 200) {
        if (responseText) {
          const data = JSON.parse(responseText).data
          return data.studies
        } else {
          return []
        }
      }

      throw responseText
    } catch (err) {
      console.error(JSON.stringify(err))
      return Promise.reject('alp-user-client: Error getting alp studies db metadata')
    }
  }

  async getStudyMetadata(token: string, studyId: string): Promise<StudyWithMetadata> {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized:
          this.config.graphqlEndpoint.startsWith('https://localhost:') ||
          this.config.graphqlEndpoint.startsWith('https://alp-mercury-approuter:')
            ? false
            : true
      })

      const response = await fetch(this.config.graphqlEndpoint, {
        method: 'POST',
        headers: {
          authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            query ($id: String!) {
              study(id: $id) {
                id
                studyMetadata {
                  name
                  value
                  dataType
                }
              }
            }`,
          variables: {
            id: studyId
          }
        }),
        agent: httpsAgent
      })

      const responseText = await response.text()

      if (response.status === 200) {
        if (responseText) {
          return JSON.parse(responseText).data
        }
      }

      throw responseText
    } catch (err) {
      console.error(JSON.stringify(err))
      return Promise.reject("alp-user-client: Error getting alp study's metadata")
    }
  }
}
