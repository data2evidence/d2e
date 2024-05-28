import { Controller, Get, Query } from '@nestjs/common'
import { transformPipe } from '../../common/pipe/TransformPipe'
import { PublicDatasetQueryService } from './public-dataset-query.service'
import { PublicDatasetQueryDto } from '../dto/public-dataset.query.dto'

@Controller()
export class PublicDatasetController {
  constructor(private readonly publicDatasetQueryService: PublicDatasetQueryService) {}

  @Get('list')
  async getDatasets(@Query(transformPipe) queryParams: PublicDatasetQueryDto) {
    return await this.publicDatasetQueryService.getDatasets(queryParams)
  }
}
