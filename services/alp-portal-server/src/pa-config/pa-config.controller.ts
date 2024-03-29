import { Controller, Get } from '@nestjs/common'
import { PatientAnalyticsConfigService } from './pa-config.service'

@Controller('pa-config')
export class PatientAnalyticsConfigController {
  constructor(private readonly paConfigService: PatientAnalyticsConfigService) {}

  @Get('metadata/list')
  async getList() {
    return await this.paConfigService.getList()
  }
}
