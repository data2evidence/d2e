import { AxiosRequestConfig } from 'axios'
import { MedplumClient } from '@medplum/core'
import { Project } from '@medplum/fhirtypes'
import { env, services } from '../env'
import { createLogger } from '../Logger'

export class FhirAPI {
  private readonly baseURL: string
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly logger = createLogger(this.constructor.name)
  private medplumClient: MedplumClient

  constructor() {
    if (services.fhir) {
      this.baseURL = services.fhir
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

    this.medplumClient = new MedplumClient({
      baseUrl: this.baseURL
    })
  }

  private async clientCredentialslogin() {
    try {
      const res = await this.medplumClient.startClientLogin(this.clientId, this.clientSecret)
    } catch (error) {
      this.logger.error('Error performing client credentials authentication', error)
    }
  }

  async createProject(name: string, description: string) {
    try {
      await this.clientCredentialslogin()

      const resource: Project = {
        resourceType: 'Project',
        name: name,
        description: description,
        features:['bots']
      }

      return await this.medplumClient.createResource(resource)
    } catch (error) {
      console.log(error)
    }
  }
}
