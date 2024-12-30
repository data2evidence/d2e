import https from 'https'
import axios, { AxiosRequestConfig } from 'axios'
import { ICohort } from '../types'
import { env } from '../env'

export class AnalyticsSvcAPI {
  private readonly baseURL: string
  private readonly httpsAgent: any
  private readonly token: string
  private readonly endpoint: string = '/analytics-svc/api/services'

  constructor(token: string) {
    this.token = token
    if (!token) {
      throw new Error('No token passed for Analytics API!')
    }

    if (env.SERVICE_ROUTES.analytics) {
      this.baseURL = env.SERVICE_ROUTES.analytics + this.endpoint
      this.httpsAgent = new https.Agent({
        rejectUnauthorized: true,
        ca: env.GATEWAY_CA_CERT,
      })
    } else {
      console.error('No url is set for AnalyticsSvcAPI')
      throw new Error('No url is set for AnalyticsAPI')
    }
  }

  isAuthorized(): boolean {
    return this.baseURL.startsWith('https://localhost:') || this.baseURL.startsWith('https://alp-minerva-gateway-')
      ? false
      : true
  }

  // Fetch CDM version
  async getAllCohorts(datasetId: string): Promise<ICohort[]> {
    try {
      const url = `${this.baseURL}/cohort`
      console.log(`Calling ${url} to fetch CDM version`)
      const options = this.getRequestConfig()
      const params = new URLSearchParams()
      params.append('datasetId', datasetId)
      const result = await axios.get(url, { ...options, params })
      return result.data.data
    } catch (error) {
      console.error(`Error while getting cdm version: ${error}`)
      throw error
    }
  }

  private getRequestConfig() {
    let options: AxiosRequestConfig = {}

    options = {
      headers: {
        Authorization: this.token,
      },
      httpsAgent: this.httpsAgent,
      timeout: 20000,
    }

    return options
  }
}
