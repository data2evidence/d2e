import axios, { AxiosRequestConfig } from 'axios'
import { env, services } from '../env'
import { createLogger } from '../Logger'
import { Agent } from 'https'

export class PrefectAPI {
  private readonly logger = createLogger(this.constructor.name)
  private readonly httpsAgent: Agent
  private readonly baseURL: string
  private readonly token: string

  constructor(token: string) {
    this.token = token
    if (!token) {
      throw new Error('No token passed for PrefectAPI')
    }
    if (services.prefect) {
      this.baseURL = services.prefect
      this.httpsAgent = new Agent({
        rejectUnauthorized: true,
        ca: env.GATEWAY_CA_CERT
      })
    } else {
      this.logger.error('No url is set for PrefectAPI')
      throw new Error('No url is set for PrefectAPI')
    }
  }

  private async getRequestConfig() {
    let options: AxiosRequestConfig = {}

    options = {
      headers: {
        Authorization: this.token
      },
      httpsAgent: this.httpsAgent
    }

    return options
  }

  async getHealthStatus() {
    try {
      const options = await this.getRequestConfig()
      const url = `${this.baseURL}/health`
      const result = await axios.get(url, options)
      return result.data
    } catch (error) {
      this.logger.error('Error getting health status')
      throw new Error('Error getting health status')
    }
  }
}
