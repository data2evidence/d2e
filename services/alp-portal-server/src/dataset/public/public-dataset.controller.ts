import { Controller, Get } from '@nestjs/common'
import { PublicDatasetQueryService } from './public-dataset-query.service'

@Controller()
export class PublicDatasetController {
  constructor(private readonly publicDatasetQueryService: PublicDatasetQueryService) {}

  @Get('list')
  async getDatasets() {
    return await this.publicDatasetQueryService.getDatasets()
  }
}
