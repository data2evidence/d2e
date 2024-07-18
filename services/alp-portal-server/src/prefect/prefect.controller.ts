import { Controller, Delete, Query, Get } from '@nestjs/common'
import { PrefectService } from './prefect.service'
import { PrefectDeploymentDeletionDto, PrefectFlowRunResultDto } from './dto'

@Controller()
export class PrefectController {
  constructor(private readonly prefectService: PrefectService) {}

  @Delete()
  async deleteDeployment(@Query() prefectDeploymentDeletionDto: PrefectDeploymentDeletionDto) {
    return await this.prefectService.deleteDeploymentResource(prefectDeploymentDeletionDto)
  }

  @Get('dqd')
  async getFlowRunResults(@Query() prefectFlowRunResultDto: PrefectFlowRunResultDto) {
    return await this.prefectService.getFlowRunResults(prefectFlowRunResultDto)
  }
}
