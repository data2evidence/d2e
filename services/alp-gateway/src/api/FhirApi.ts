import { env, services } from '../env'
import { createLogger } from '../Logger'
import { Agent } from 'https'
import { post } from './request-util'

export class FhirAPI {
  private readonly baseURL: string
  private readonly fhirTokenUrl: string
  private readonly logger = createLogger(this.constructor.name)
  private token: string
  private readonly httpsAgent: Agent
  private readonly clientId: string
  private readonly clientSecret: string

  constructor() {
    if (services.fhir) {
      this.baseURL = services.fhir
      this.fhirTokenUrl = services.fhirTokenUrl
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
    const formBody = new URLSearchParams()
    formBody.set('grant_type', 'client_credentials')
    formBody.set('client_id', this.clientId)
    formBody.set('client_secret', this.clientSecret)

    const options = {
      body: formBody.toString(),
      credentials: 'include',
      headers: {
        Authorization: `Basic ${Buffer.from(this.clientId + ':' + this.clientSecret, 'binary').toString('base64')}`
      }
    }
    const headers = options.headers
    headers['Content-type'] = 'application/x-www-form-urlencoded'
    return options
  }

  async authenticate() {
    try {
      let response
      try {
        const options = await this.getRequestConfig();
        response = await post(this.fhirTokenUrl, options)
      } catch (err) {
        throw err
      }

      if (!response.ok) {
        try {
          const error = await response.json()
          throw error
        } catch (err) {
          throw 'Failed to fetch tokens: ' + err
        }
      }
      this.token = await response.json()
    } catch (err) {
      throw err
    }
  }

  // async createProject(name: string, description: string) {
  //   try {
  //     this.logger.info(`Create fhir project for the dataset`)
  //     await this.authenticate()
  //     const options = await this.getRequestConfig()
  //     const url = `${this.baseURL}/createProject`
  //     const details = {
  //       name: name,
  //       description: description
  //     }
  //     const result = await post(url, details, options)
  //     if (result.data) {
  //       return result.data
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  async importData(fhirResouce: string, resourceDetails: string) {
    try {
      this.logger.info(`Import data into fhir server`)
      const options = await this.getRequestConfig()
      const url = `${this.baseURL}/${fhirResouce}`
      const result = await post(url, resourceDetails, options)
      if (result.data) {
        return result.data
      }
    } catch (err) {
      throw new Error(`Failed to import data into fhir server`)
    }
  }
}
