import { createLogger } from '../logger'
import { FhirAPI } from '../api/FhirAPI'
import { v4 as uuidv4 } from 'npm:uuid'
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
        return projectId
    } catch (error) {
        throw new Error(`Failed to create project in fhir server: ${error}`)
    }
}

export const createResourceInProject = async (fhirResouce: string, resourceDetails: any, projectName: string) => {
    try{
        let fhirApi = new FhirAPI()
        const searchResult = await fhirApi.getResource('ClientApplication', `name=${projectName}`) 
        if (searchResult) {
            const clientId = searchResult.id
            const clientSecret = searchResult.secret
            await fhirApi.clientCredentialslogin(clientId, clientSecret)
            await fhirApi.post(fhirResouce, resourceDetails)
            return true
        } else {
            throw 'Dataset not found!'
        }
    }catch(error){
        logger.error(JSON.stringify(error))
        return false
    }
}
