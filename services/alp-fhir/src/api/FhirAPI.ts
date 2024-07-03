
import { CreateBinaryOptions, MedplumClient } from '@medplum/core'
import { Project, Resource, Attachment } from '@medplum/fhirtypes'
import { env } from '../env'
import { createLogger } from '../logger'
import { ContentType, createReference, getReferenceString } from '@medplum/core';
import { getBinaryStorage } from '../utils/fhirStorage';

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
        this.medplumClient = new MedplumClient()
    }

    private async clientCredentialslogin() {
        try {
        const res = await this.medplumClient.startClientLogin(this.clientId, this.clientSecret)
        } catch (error) {
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

    // async createResource_Bot(name: string, description: string, botCode: string, projectId: string){
    //     const filename = 'index.ts';
    //     const contentType = ContentType.TYPESCRIPT;
    //     const binary = await this.medplumClient.createResource<Binary>({
    //     resourceType: 'Binary',
    //     contentType,
    //     });
    //     await getBinaryStorage().writeBinary(binary, filename, contentType, Readable.from(defaultBotCode));
    
    //     const bot = await this.medplumClient.createResource<Bot>({
    //     meta: {
    //         project: projectId,
    //     },
    //     resourceType: 'Bot',
    //     name: name,
    //     description: description,
    //     runtimeVersion: request.runtimeVersion ?? getConfig().defaultBotRuntimeVersion,
    //     sourceCode: {
    //         contentType,
    //         title: filename,
    //         url: getReferenceString(binary),
    //     },
    //     });
    
    //     const systemRepo = getSystemRepo();
    //     await systemRepo.createResource<ProjectMembership>({
    //     meta: {
    //         project: request.project.id,
    //     },
    //     resourceType: 'ProjectMembership',
    //     project: createReference(request.project),
    //     user: createReference(bot),
    //     profile: createReference(bot),
    //     accessPolicy: request.accessPolicy,
    //     });
    
    //     return bot;
    // }
}
