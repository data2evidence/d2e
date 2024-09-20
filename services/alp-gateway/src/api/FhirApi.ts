import { env, services } from '../env'
import { createLogger } from '../Logger'
import { Agent } from 'https'
import { get, post } from './request-util'
import * as crypto from 'crypto'
import { PortalAPI } from './PortalAPI'
import { Dataset } from 'src/types'

export class FhirAPI {
  private readonly baseURL: string
  private readonly fhirTokenUrl: string
  private readonly logger = createLogger(this.constructor.name)
  private fhirServerToken: string
  private readonly httpsAgent: Agent
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly token: string

  constructor(token: string) {
    this.token = token
    if (!token) {
      throw new Error('No token passed for Analytics API!')
    }
    if (services.fhir) {
      this.baseURL = services.fhir
      this.fhirTokenUrl = services.fhirTokenUrl
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
        Authorization: this.fhirServerToken
      },
      httpsAgent: this.httpsAgent
    }
    return options
  }

  async authenticate(clientId: string, clientSecret: string) {
    try {
      let response
      try {
        const params = {
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret
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

      if (response && response.status != 200) {
        throw 'Failed to fetch tokens'
      }
      this.fhirServerToken = response.data.token_type + ' ' + response.data.access_token
    } catch (err) {
      throw err
    }
  }

  async createProject(name: string, description: string) {
    try {
      this.logger.info(`Create fhir project for the dataset`)
      const ProjectDetails = {
        resourceType: 'Project',
        name: name,
        strictMode: true,
        features: ['bots'],
        description: description
      }
      const ProjectResult = await this.createResource('Project', ProjectDetails)
      const projectId = ProjectResult.data.id

      this.logger.info('Create client application for the project')
      const clientSecret = crypto.randomBytes(32).toString('hex')
      const clientApplicationDetails = {
        resourceType: 'ClientApplication',
        name: name,
        description: description,
        meta: {
          project: projectId,
          compartment: [
            {
              reference: `Project/${projectId}`
            }
          ]
        },
        secret: clientSecret
      }
      const ClientApplicationResult = await this.createResource(
        'ClientApplication',
        clientApplicationDetails,
        '',
        false
      )
      const clientId = ClientApplicationResult.data.id

      this.logger.info('Create project membership for the project')
      const projectMembershipDetails = {
        resourceType: 'ProjectMembership',
        project: {
          reference: `Project/${projectId}`
        },
        meta: {
          project: projectId,
          compartment: [
            {
              reference: `Project/${projectId}`
            }
          ]
        },
        user: {
          reference: `ClientApplication/${clientId}`,
          display: name
        },
        profile: {
          reference: `ClientApplication/${clientId}`,
          display: name
        }
      }
      await this.createResource('ProjectMembership', projectMembershipDetails, '', false)
      return projectId
    } catch (error) {
      throw new Error(`Failed to create project in fhir server: ${error}`)
    }
  }

  async createResource(fhirResouce: string, resourceDetails: any, projectName?: string, isAuthenticate = true) {
    try {
      this.logger.info(`Import data into fhir server`)
      if (isAuthenticate) await this.authenticate(this.clientId, this.clientSecret)
      let options = await this.getRequestConfig()
      // If the incoming resource is for a particular project, then get the project's clientId and secret for Authentication
      if (projectName && projectName != '') {
        const url = `${this.baseURL}/ClientApplication?name=${projectName}`
        const searchResult = await get(url, options)
        if (searchResult.data.entry && searchResult.data.entry.length > 0) {
          let datasetId = ''
          const clientId = searchResult.data.entry[0].resource.id
          const clientSecret = searchResult.data.entry[0].resource.secret
          await this.authenticate(clientId, clientSecret)
          options = await this.getRequestConfig()

          //Get datasets
          const portalAPI = new PortalAPI(this.token)
          const datasets: Dataset[] = await portalAPI.getDatasets()
          const resourceDataset = datasets.filter(dataset => {
            if (dataset.studyDetail.name == projectName) return dataset
          })
          //Get dataset Id of incoming resource
          if (resourceDataset.length > 0) {
            datasetId = resourceDataset[0].id
          }
          //Set datasetId in the metadata of the resource
          const metaInfo = {
            author: {
              reference: 'ClientApplication/' + clientId
            },
            id: datasetId
          }
          resourceDetails.meta = metaInfo
        } else throw 'Dataset not found!'
      }
      const url = `${this.baseURL}/${fhirResouce}`
      const result = await post(url, resourceDetails, options)
      if (result.status != 201) {
        throw result
      }
      return result
    } catch (error) {
      throw new Error(error)
    }
  }
}
