import https from 'https'
import fetch from 'node-fetch'
import 'cross-fetch/polyfill'

import { UserConfigType, Study } from './types'

export default class AlpClient {
  private config: UserConfigType
  constructor(inputConfig: UserConfigType) {
    this.config = { ...inputConfig }

    if (!this.config.graphqlEndpoint) {
      throw new Error('alp-metadata: Graphql endpoint is not configured')
    }
  }

  async getStudies(token: string, authType = ''): Promise<Study[]> {
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
          'auth-type': authType,
          authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            {
              studiesRaw {
                databaseName
                id
                tokenStudyCode
                schemaName
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

          return data.studiesRaw
            .map((el: any) => {
              return {
                studyId: el.id,
                tokenStudyCode: el.tokenStudyCode,
                name: el.studyDetail?.name || 'Untitled',
                schemaName: el.schemaName,
                databaseName: el.databaseName
              }
            })
            .filter((study: Study) => study != null)
        } else {
          return []
        }
      }

      throw responseText
    } catch (err) {
      console.error(JSON.stringify(err))
      return Promise.reject('alp-metadata: Error getting alp studies metadata')
    }
  }
}
