import { Controller, Post, Body } from '@nestjs/common'
import { DBSvcService } from './db-svc.service'
import { DBSvcFlowRunDto, DatasetAttributesFlowRunDto } from './dto'

@Controller()
export class DBSvcController {
  constructor(private readonly dbSvcService: DBSvcService) {}

  @Post('run')
  createDbSvcFlowRun(@Body() dbSvcFlowRunDto: DBSvcFlowRunDto) {
    return this.dbSvcService.createDbSvcFlowRun(dbSvcFlowRunDto)
  }

  @Post('fetch-version-info')
  createFetchVersionInfoFlowRun() {
    return this.dbSvcService.fetchVersionInfo()
  }

  @Post('dataset-attributes')
  createDatasetAttributesFlowRun(@Body() datasetAttributesDto: DatasetAttributesFlowRunDto) {
    return this.dbSvcService.updateDatasetAttributes(datasetAttributesDto)
  }
}
