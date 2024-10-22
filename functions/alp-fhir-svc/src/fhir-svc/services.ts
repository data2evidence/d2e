import { createLogger } from '../logger'
import { FhirAPI } from '../api/FhirAPI'
import { v4 as uuidv4 } from 'npm:uuid'
import { PortalAPI } from '../api/PortalAPI'
import { Dataset } from '../utils/types'
import { Bundle } from '@medplum/fhirtypes'
import { createResourceInFhir } from '../utils/fhirDataModelUtil'
import { getClientCredentialsToken } from '../utils/dbUtils'
import { env } from '../env'

const logger = createLogger()

export const createProject = async (name: string, description: string) => {
    try {
        logger.info(`Create fhir project for the dataset`)
        let fhirApi = new FhirAPI()
        await fhirApi.clientCredentialslogin()
        const projectDetails = {
            resourceType: 'Project',
            name: name,
            strictMode: true,
            features: ['bots'],
            description: description
        }
        const projectResult = await fhirApi.post('Project', projectDetails)
        const projectId = projectResult.id
        
        logger.info('Create client application for the project')
        const clientSecret = uuidv4()
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
        const clientApplicationResult = await fhirApi.post('ClientApplication', clientApplicationDetails)
        const clientId = clientApplicationResult.id

        logger.info('Create project membership for the project')
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
        await fhirApi.post('ProjectMembership', projectMembershipDetails)
        await createSubscriptionInFhirServer(fhirApi, clientId, projectId)
        return projectId
    } catch (error) {
        throw new Error(`Failed to create project in fhir server: ${error}`)
    }
}

export const createResourceInProject = async (token: string, fhirResouce: string, resourceDetails: any, projectName: string) => {
    try{
        let fhirApi = new FhirAPI()
        let datasetId = '', clientId = '', clientSecret = ''
        await fhirApi.clientCredentialslogin()
        const searchResult = await fhirApi.getResource('ClientApplication', `name=${projectName}`) 
        console.info(searchResult)
        if (searchResult) {
            clientId = searchResult.id
            clientSecret = searchResult.secret
        }else
            throw "Dataset not found!"
        let getSubscription = await fhirApi.getResource('Subscription', `criteria=${fhirResouce}&author=${clientId}`)
        console.info(getSubscription)
        //Update Subscription resource with Authorization header
        getSubscription.channel.header = [`Authorization: ${token}`]
        await fhirApi.updateResource(getSubscription)
        //Get datasets
        const portalAPI = new PortalAPI(token)
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
        await fhirApi.clientCredentialslogin(clientId, clientSecret)
        await fhirApi.post(fhirResouce, resourceDetails)
        return true
    }catch(error){
        logger.error(JSON.stringify(error))
        return false
    }
}

export const createResourceInCacheDB = async (fhirResouce: string) => {
    logger.info(`Received request to create resources in CacheDb`)
    let bundle: Bundle = fhirResouce
    
    if (bundle.entry === undefined){
      console.log('No entries in the bundle')
      return;
    }
    let token = await getClientCredentialsToken()
    for (const entry of bundle.entry) {
      console.info('Create resource for each of the entry in the bundle')
      await createResourceInFhir(token, entry.resource)
    }
    return true
}

//Create subscription for each dataset to trigger endpoint
async function createSubscriptionInFhirServer(fhirApi: FhirAPI, clientId: string, projectId: string){
    const baseUrl = env.SERVICE_ROUTES.fhirSvc
    const subscriptionDetails = {
            "resourceType": "Subscription",
            "status": "active",
            "reason": "Rest hook subscription for Bundle",
            "channel": {
              "type": "rest-hook",
              "endpoint": `${baseUrl}/createResource/Bundle`
            },
            "criteria": "Bundle",
            "meta": {
              "author": {
                "reference": `ClientApplication/${clientId}`,
                "display": "d2eClient"
              },
              "project": `${projectId}`,
              "compartment": [
                {
                  "reference": `Project/${projectId}`
                }
              ]
            }
          }
    const result = await fhirApi.post('Subscription', subscriptionDetails)
    return result
}