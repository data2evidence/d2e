import { Inject, Injectable, Scope, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { JwtPayload, decode } from 'jsonwebtoken'
import { DatasetTagConfigRepository, DatasetAttributeConfigRepository } from '../repository'
import { createLogger } from '../../logger'
import { DEFAULT_ERROR_MESSAGE } from '../../common/const'
import { MetadataConfigTagDto, MetdataConfigAttributeDto } from '../dto'
import { DatasetTagConfig, DatasetAttributeConfig } from '../entity'

@Injectable({ scope: Scope.REQUEST })
export class MetadataConfigService {
  private readonly userId: string
  private readonly logger = createLogger(this.constructor.name)

  constructor(
    private readonly tagConfigRepo: DatasetTagConfigRepository,
    private readonly attributeConfigRepo: DatasetAttributeConfigRepository,
    @Inject(REQUEST) request: Request
  ) {
    const token = decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload
    this.userId = token.sub
  }

  async getTagConfigNames(): Promise<string[]> {
    const tagConfigs = await this.tagConfigRepo.getTagConfigs()
    return tagConfigs.map(tagConfig => tagConfig['name'])
  }

  async insertTagConfig(tagConfigDto: MetadataConfigTagDto): Promise<string> {
    try {
      const tagConfigEntity = this.tagConfigRepo.create({ ...tagConfigDto })
      await this.tagConfigRepo.insertTagConfig(this.addOwner(tagConfigEntity, true))
      this.logger.info(`Created new tag config ${tagConfigEntity.name}`)
      return tagConfigEntity.name
    } catch (error) {
      this.logger.error(`Error while creating new tag config: ${error}`)
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  async deleteTagConfig(name: string): Promise<string> {
    try {
      const tagConfig = await this.getTagConfig(name)
      await this.tagConfigRepo.deleteTagConfig(tagConfig)
      return tagConfig.name
    } catch (error) {
      this.logger.error(`Error deleting tag config with name ${name}: ${error}`)
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Tag config with name ${name} not found`)
      }
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  private async getTagConfig(name: string): Promise<DatasetTagConfig> {
    const tagConfig = await this.tagConfigRepo.findOne({ where: { name } })
    if (!tagConfig) {
      throw new NotFoundException(`Tag config with name ${name} not found`)
    }
    return tagConfig
  }

  async getAttributeConfigs(): Promise<DatasetAttributeConfig[]> {
    return await this.attributeConfigRepo.getAttributeConfigs()
  }

  async insertAttributeConfig(attributeConfigDto: MetdataConfigAttributeDto): Promise<string> {
    try {
      const attributeConfigEntity = this.attributeConfigRepo.create({ ...attributeConfigDto })
      await this.attributeConfigRepo.insertAttributeConfig(this.addOwner(attributeConfigEntity, true))
      this.logger.info(`Created new attribute config ${attributeConfigEntity.name}`)
      return attributeConfigEntity.id
    } catch (error) {
      this.logger.error(`Error while creating new attribute config: ${error}`)
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  async updateAttributeConfig(attributeConfigDto: MetdataConfigAttributeDto): Promise<string> {
    try {
      const attributeConfigEntity = this.attributeConfigRepo.create({ ...attributeConfigDto })
      await this.attributeConfigRepo.updateAttributeConfig(
        attributeConfigEntity.id,
        this.addOwner(attributeConfigEntity)
      )
      this.logger.info(`Updated attribute config with id ${attributeConfigEntity.id}`)
      return attributeConfigEntity.id
    } catch (error) {
      this.logger.error(`Error while updating attribute config: ${error}`)
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  async deleteAttributeConfig(id: string): Promise<string> {
    try {
      const attributeConfig = await this.getAttributeConfig(id)
      await this.attributeConfigRepo.deleteAttributeConfig(attributeConfig)
      return attributeConfig.id
    } catch (error) {
      this.logger.error(`Error deleting tag config with id ${id}: ${error}`)
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Tag config with id ${id} not found`)
      }
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  private async getAttributeConfig(id: string): Promise<DatasetAttributeConfig> {
    const attributeConfig = await this.attributeConfigRepo.findOne({ where: { id } })
    if (!attributeConfig) {
      throw new NotFoundException(`Tag config with id ${id} not found`)
    }
    return attributeConfig
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
