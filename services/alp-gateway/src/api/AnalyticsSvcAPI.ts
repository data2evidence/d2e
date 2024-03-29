import { AxiosRequestConfig } from 'axios'
import { get } from './request-util'
import { env } from '../env'
import { createLogger } from '../Logger'
import https from 'https'

export class AnalyticsSvcAPI {
  private readonly baseURL: string
  private readonly httpsAgent: any
  private readonly logger = createLogger(this.constructor.name)
  private readonly token: string

  constructor(token: string) {
    this.token = token
    if (!token) {
      throw new Error('No token passed for Analytics API!')
    }
    if (env.ANALYTICS_SVC_API_BASE_URL) {
      this.baseURL = env.ANALYTICS_SVC_API_BASE_URL
      this.httpsAgent = new https.Agent({
        rejectUnauthorized:
          this.baseURL.startsWith('https://localhost:') || this.baseURL.startsWith('https://alp-minerva-gateway-')
            ? false
            : true
      })
    } else {
      this.logger.error('No url is set for AnalyticsSvcAPI')
      throw new Error('No url is set for AnalyticsSvcAPI')
    }
  }

  private async getRequestConfig() {
    let options: AxiosRequestConfig = {}

    options = {
      headers: {
        Authorization: this.token
      },
      httpsAgent: this.httpsAgent,
      timeout: 20000
    }

    return options
  }

  async getAllCohorts(studyId: string) {
    const options = await this.getRequestConfig()
    const url = `${this.baseURL}api/services/cohort?studyId=${studyId}`
    const result = await get(url, options)
    return result.data
  }

  // alpdb endpoints
  async checkIfSchemaExists(databaseDialect: string, databaseCode: string, schemaName: string): Promise<boolean> {
    this.logger.info(`Checking if schema exists for ${schemaName} in ${databaseCode}`)
    const options = await this.getRequestConfig()
    const url = `${this.baseURL}api/services/alpdb/${databaseDialect}/database/${databaseCode}/schema/${schemaName}/exists`
    try {
      const result = await get(url, options)
      return result.data
    } catch (error) {
      const errorMessage = `Failed to check if schema exists for ${schemaName} in ${databaseCode}`
      this.logger.error(`${errorMessage}: ${error}`)
      throw new Error(errorMessage)
    }
  }

  async getCdmSchemaSnapshotMetadata(databaseDialect: string, databaseCode: string, schemaName: string) {
    this.logger.info(`Getting CDM schema snapshot metadata for ${schemaName} in ${databaseCode}`)
    const options = await this.getRequestConfig()
    const url = `${this.baseURL}api/services/alpdb/${databaseDialect}/database/${databaseCode}/metadata/schemasnapshot/schema/${schemaName}`
    const result = await get(url, options)
    if (result.data) {
      return result.data
    }
    throw new Error(`Failed to get CDM schema snapshot metadata for ${schemaName} in ${databaseCode}`)
  }
}
