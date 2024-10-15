import { Controller, Get, Query, ParseUUIDPipe } from '@nestjs/common'
import { DatasetPaConfigService } from './dataset-pa-config.service'

@Controller()
export class DatasetPaConfigController {
  constructor(private readonly datasetPaConfigService: DatasetPaConfigService) {}

  @Get('backend')
  async getDatasetBackendPaConfig(@Query('datasetId', ParseUUIDPipe) id) {
    return await this.datasetPaConfigService.getDatasetBackendPaConfig(id)
  }

  @Get('me')
  async getMyDatasetPaConfig(@Query('datasetId', ParseUUIDPipe) id) {
    return await this.datasetPaConfigService.getMyDatasetPaConfig(id)
  }
}
