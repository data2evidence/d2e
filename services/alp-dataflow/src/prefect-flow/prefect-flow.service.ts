import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrefectFlowDto } from './dto'
import { PrefectAPI } from '../prefect/prefect.api'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { InjectRepository } from '@nestjs/typeorm'
import { FlowMetadata } from './entity'
import { DefaultPlugins } from './entity'
import { Repository } from 'typeorm'
import { createLogger } from '../logger'
import { IFlowMetadataDto } from '../types'
import { FLOW_METADATA, PluginUploadStatus } from '../common/const'
import { REQUEST } from '@nestjs/core'
import { join } from 'path'
import { JwtPayload, decode } from 'jsonwebtoken'

@Injectable()
export class PrefectFlowService {
  private readonly logger = createLogger(this.constructor.name)
  private readonly userId: string

  constructor(
    @Inject(REQUEST) request: Request,
    @InjectRepository(FlowMetadata)
    private readonly flowMetadataRepo: Repository<FlowMetadata>,
    @InjectRepository(DefaultPlugins)
    private readonly defaultPluginsRepo: Repository<DefaultPlugins>,
    private readonly prefectApi: PrefectAPI,
    private readonly portalServerApi: PortalServerAPI
  ) {
    const token = decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload
    this.userId = token.sub
  }

  async getFlows() {
    return this.prefectApi.getFlows()
  }

  async getDeploymentByFlowId(id: string) {
    return this.prefectApi.getDeploymentByFlowId(id)
  }

  async createFlow(prefectFlowDto: PrefectFlowDto) {
    return this.prefectApi.createFlow(prefectFlowDto)
  }

  async deleteFlow(id: string) {
    await this.deleteFlowDeployment(id)
    return this.prefectApi.deleteFlow(id)
  }

  async getFlowMetadata() {
    return await this.flowMetadataRepo
      .createQueryBuilder('prefect_flow_metadata')
      .orderBy('prefect_flow_metadata.modified_date', 'DESC')
      .getMany()
  }

  async getFlowMetadataById(flowId: string) {
    return await this.flowMetadataRepo
      .createQueryBuilder('prefect_flow_metadata')
      .where('prefect_flow_metadata.flowId = :flowId', { flowId })
      .getOne()
  }

  async getFlowMetadataByType(type: string) {
    return await this.flowMetadataRepo
      .createQueryBuilder('prefect_flow_metadata')
      .where('prefect_flow_metadata.type = :type', { type })
      .getMany()
  }

  async getDataModels() {
    const flows = await this.getFlowMetadataByType(FLOW_METADATA.datamodel)
    if (flows.length > 0) {
      const newDatamodels = []
      flows.forEach(flow => {
        flow.datamodels.forEach(d => {
          newDatamodels.push({ flowName: `${flow.name}`, datamodel: d, flowId: flow.flowId })
        })
      })
      return newDatamodels
    }
    return flows
  }

  async deleteFlowMetadata(flowId: string) {
    await this.flowMetadataRepo.delete({ flowId: flowId })
  }

  async createFlowMetadata(flowMetadataDto: IFlowMetadataDto) {
    const existingFlowMetadata = await this.getFlowMetadataById(flowMetadataDto.flowId)
    if (existingFlowMetadata) {
      return await this.updateFlowMetadata(flowMetadataDto)
    } else {
      return await this.createNewFlowMetadata(flowMetadataDto)
    }
  }

  async getDefaultPluginById(pluginId: string) {
    return await this.defaultPluginsRepo
      .createQueryBuilder('default_plugins')
      .where('default_plugins.pluginId = :pluginId', { pluginId })
      .getOne()
  }

  async getDefaultPlugins() {
    return await this.defaultPluginsRepo.createQueryBuilder('default_plugins').getMany()
  }

  async updateDefaultPluginStatus(pluginId: string, status: PluginUploadStatus) {
    return await this.defaultPluginsRepo.update({ pluginId }, { status })
  }

  private async createNewFlowMetadata(flowMetadataDto: IFlowMetadataDto) {
    this.logger.info(`Creating new flow metadata for ${flowMetadataDto.name} of type ${flowMetadataDto.type}`)
    const flowMetadataEntity = await this.flowMetadataRepo.create(flowMetadataDto)
    await this.flowMetadataRepo.insert(this.addOwner(flowMetadataEntity, true))
    return flowMetadataEntity
  }

  private async updateFlowMetadata(flowMetadataDto: IFlowMetadataDto) {
    const { flowId, ...updateData } = flowMetadataDto
    const updateObject = {} as Partial<FlowMetadata>
    if (updateData) {
      Object.assign(updateObject, updateData)
    }
    this.logger.info(`Updating flow metadata for ${flowMetadataDto.name}`)
    return await this.flowMetadataRepo.update({ flowId: flowMetadataDto.flowId }, this.addOwner(updateObject, true))
  }

  private async deleteFlowDeployment(flowId: string) {
    const metadata = await this.getFlowMetadataById(flowId)
    if (metadata) {
      try {
        // flow deployment path is specified as userId/flow-name
        const deploymentPath = join(metadata.createdBy, metadata.name.replace(/[.-]/g, '_'))
        await this.portalServerApi.deleteDeploymentFiles(deploymentPath)
        await this.deleteFlowMetadata(flowId)
        return flowId
      } catch (err) {
        this.logger.error(`Error deleting flow deployment files for ${flowId}: ${err}`)
        throw new InternalServerErrorException(`Error deleting flow deployment files for ${flowId}: ${err}`)
      }
    }
    this.logger.info(`No flow deployment files found for ${flowId}`)
    return flowId
  }

  private addOwner<T>(object: T, isNewEntity = false) {
    if (isNewEntity) {
      return {
        ...object,
        createdBy: this.userId,
        modifiedBy: this.userId
      }
    }
    return {
      ...object,
      modifiedBy: this.userId
    }
  }
}
