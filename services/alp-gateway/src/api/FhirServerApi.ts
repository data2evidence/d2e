import { AxiosRequestConfig } from 'axios'
import { env, services } from '../env'
import { createLogger } from '../Logger'
import { Agent } from 'https'
import { post } from './request-util'

export class FhirAPI {
  private readonly baseURL: string
  private readonly logger = createLogger(this.constructor.name)
  private readonly token: string
  private readonly httpsAgent: Agent

  constructor(token: string) {
    this.token = token
    if (!token) {
      throw new Error('No token passed for Fhir')
    }
    if (services.dataflowMgmt) {
      this.baseURL = services.dataflowMgmt
      this.httpsAgent = new Agent({
        rejectUnauthorized: true,
        ca: env.GATEWAY_CA_CERT
      })
    } else {
      this.logger.error('No url is set for Fhir')
      throw new Error('No url is set for Fhir')
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

  async importData(fhirResource: string) {
    try {
      this.logger.info(`Import data into fhir server`)
      const options = await this.getRequestConfig()
      const url = `${this.baseURL}/`
      const result = await post(url, fhirResource, options)
      if (result.data) {
        return result.data
      }
    } catch (err) {
      throw new Error(`Failed to import data into fhir server`)
    }
  }
}
