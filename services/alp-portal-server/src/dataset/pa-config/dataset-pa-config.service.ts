import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PatientAnalyticsConfigService } from '../../pa-config/pa-config.service'
import { DEFAULT_ERROR_MESSAGE } from '../../common/const'
import { Dataset } from '../entity'

@Injectable()
export class DatasetPaConfigService {
  constructor(
    @InjectRepository(Dataset) private readonly datasetRepo: Repository<Dataset>,
    private readonly paConfigService: PatientAnalyticsConfigService
  ) {}

  async getDatasetBackendPaConfig(datasetId: string) {
    const dataset = await this.getDataset(datasetId)
    try {
      return this.paConfigService.getBackendConfig(dataset.paConfigId)
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException(`Dataset with id ${datasetId} does not have backend PA config`)
      }
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  async getMyDatasetPaConfig(datasetId: string) {
    const dataset = await this.getDataset(datasetId)
    try {
      return this.paConfigService.getMyConfig(dataset.paConfigId)
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException(`Dataset with id ${datasetId} does not have user's PA config`)
      }
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  private async getDataset(id: string) {
    const dataset = await this.datasetRepo.findOne({ where: { id } })
    if (!dataset) {
      throw new NotFoundException(`Dataset with id ${id} not found`)
    }
    return dataset
  }
}
