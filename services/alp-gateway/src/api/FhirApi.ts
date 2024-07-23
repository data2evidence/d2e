import { env, services } from '../env'
import { createLogger } from '../Logger'
import { Agent } from 'https'
import { post } from './request-util'

export class FhirAPI {
  private readonly baseURL: string
  private readonly fhirTokenUrl = 'http://alp-minerva-fhir-server-1:8103/oauth2/token'
  private readonly logger = createLogger(this.constructor.name)
  private token: string
  private readonly httpsAgent: Agent
  private readonly clientId: string
  private readonly clientSecret: string

  constructor() {
    if (services.fhir) {
      this.baseURL = services.fhir
      this.fhirTokenUrl = 'http://alp-minerva-fhir-server-1:8103/oauth2/token'
      this.httpsAgent = new Agent({
        rejectUnauthorized: true,
        ca: env.GATEWAY_CA_CERT
      })
    } else {
      this.logger.error('No url is set for Fhir')
      throw new Error('No url is set for Fhir')
    }

    if (env.FHIR_CLIENT_ID && env.FHIR_CLIENT_SECRET) {
      this.clientId = env.FHIR_CLIENT_ID
      this.clientSecret = env.FHIR_CLIENT_SECRET
    } else {
      this.logger.error('No client credentials are set for Fhir')
      throw new Error('No client credentials are set for Fhir')
    }
  }

  private async getRequestConfig() {
    const options = {
      headers: {
        Authorization: this.token
      },
      httpsAgent: this.httpsAgent
    }
    return options
  }

  async authenticate() {
    try {
      let response
      try {
        const params = {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret
        }
        const body = Object.keys(params)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
          .join('&')

        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        response = await post(this.fhirTokenUrl, body, config)
      } catch (err) {
        throw err
      }

      if (response.status != 200) {
        throw 'Failed to fetch tokens'
      }
      this.token = response.data.token_type + ' ' + response.data.access_token
    } catch (err) {
      throw err
    }
  }

  async createProject(name: string, description: string) {
    try {
      this.logger.info(`Create fhir project for the dataset`)
      await this.authenticate()
      const url = `${this.baseURL}/Project`
      const details = {
        resourceType: 'Project',
        name: name,
        strictMode: true,
        features: ['bots'],
        description: description
      }
      const options = await this.getRequestConfig()
      const result = await post(url, details, options)
      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  async importData(fhirResouce: string, resourceDetails: string) {
    try {
      this.logger.info(`Import data into fhir server`)
      await this.authenticate()
      const options = await this.getRequestConfig()
      const url = `${this.baseURL}/${fhirResouce}`
      const result = await post(url, resourceDetails, options)
      return result
    } catch (error) {
      throw new Error(error)
    }
  }
}
