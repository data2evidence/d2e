
import { CreateBinaryOptions, MedplumClient } from '@medplum/core'
import { Project, Resource, Attachment } from '@medplum/fhirtypes'
import { env } from '../env'
import { createLogger } from '../logger'

export class FhirAPI {
    private readonly clientId: string
    private readonly clientSecret: string
    private readonly logger = createLogger(this.constructor.name)
    private medplumClient: MedplumClient

    constructor() {
        if (env.FHIR_CLIENT_ID && env.FHIR_CLIENT_SECRET) {
        this.clientId = env.FHIR_CLIENT_ID
        this.clientSecret = env.FHIR_CLIENT_SECRET
        } else {
        this.logger.error('No client credentials are set for Fhir')
        throw new Error('No client credentials are set for Fhir')
        }
        console.log(env.SERVICE_ROUTES.fhir)
        this.medplumClient = new MedplumClient({
            baseUrl: env.SERVICE_ROUTES.fhir
        })
    }

    async clientCredentialslogin() {
        try {
        const res = await this.medplumClient.startClientLogin(this.clientId, this.clientSecret)
        console.log(JSON.stringify(res))
        return res
        } catch (error) {
            console.log(JSON.stringify(error))
            this.logger.error('Error performing client credentials authentication', error)
        }
    }

    async createResource_Project(name: string, description: string) {
        try {
        await this.clientCredentialslogin()
        return await this.medplumClient.createResource<Project>({
            resourceType: 'Project',
            name: name,
            description: description,
            features: ['bots']
        })
        } catch (error) {
            console.log(error)
        }
    }

    async readResource_Bot(id: string){
        let bot = await this.medplumClient.readResource('Bot', id);
        return bot;
    }

    async create_Bot(url: string, body: any){
       return await this.medplumClient.post(url, body);
    }

    async createAttachment_Bot(fileName: string, fileContent: string, fileContentType: string){
        let binaryOptions: CreateBinaryOptions = {
            filename: fileName,
            data: fileContent,
            contentType: fileContentType
        }
        return await this.medplumClient.createAttachment(binaryOptions)
    }

    async updateResource_Bot(resource: Resource, sourceCode: Attachment){
        return await this.medplumClient.updateResource({
            ...resource,
            sourceCode
        })
    }

    fhirUrl_Bot(botId?: string){
        return this.medplumClient.fhirUrl('Bot', botId as string, '$deploy')
    }
}
