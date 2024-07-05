
import { CreateBinaryOptions, MedplumClient, OperationOutcomeError } from '@medplum/core'
import { Resource, Attachment, Bot, Subscription } from '@medplum/fhirtypes'
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
        this.medplumClient = new MedplumClient({
            baseUrl: env.SERVICE_ROUTES.fhir
        })
    }

    async clientCredentialslogin() {
        try {
            return await this.medplumClient.startClientLogin(this.clientId, this.clientSecret)
        } catch (error) {
            console.log(JSON.stringify(error))
            this.logger.error('Error performing client credentials authentication', error)
        }
    }

    // async createResource_Project(name: string, description: string) {
    //     try {
    //         return await this.medplumClient.createResource<Project>({
    //             resourceType: 'Project',
    //             name: name,
    //             description: description,
    //             features: ['bots']
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    async readResource_bot(id: string){
        try{
            return await this.medplumClient.readResource('Bot', id);
        }catch(err){
            if(err instanceof OperationOutcomeError && err.outcome.id == 'not-found'){
                let bot: Bot = {
                    resourceType: 'Bot'
                }
                return bot
            }else{
                console.log("Not of type Operation outcome")
                throw err;
            }
        }
    }

    async searchResource_bot(query: string){
        return await this.medplumClient.searchOne('Bot', query=query)
    }

    async create_bot(url: string, body: any){
       return await this.medplumClient.post(url, body);
    }

    async createAttachment_bot(fileName: string, fileContent: string, fileContentType: string){
        let binaryOptions: CreateBinaryOptions = {
            filename: fileName,
            data: fileContent,
            contentType: fileContentType
        }
        return await this.medplumClient.createAttachment(binaryOptions)
    }

    async updateResource_bot(resource: Resource, sourceCode: Attachment){
        return await this.medplumClient.updateResource({
            ...resource,
            sourceCode
        })
    }

    fhirUrl_bot(action: string, botId?: string){
        return this.medplumClient.fhirUrl('Bot', botId as string, action)
    }

    // async executeBot(botId: string){
    //     return await this.medplumClient.executeBot(botId, {})
    // }

    async createResource_subscription(endpoint: string, reason: string, criteria: any){
        return await this.medplumClient.createResource<Subscription>({
            resourceType: 'Subscription',
            status: 'active',
            reason: reason,
            channel: { type: 'rest-hook', endpoint:  endpoint},
            criteria: criteria
        });
    }
    
    async searchResource_subscription(query: string){
        return await this.medplumClient.searchOne('Subscription', query=query)
    }
}
