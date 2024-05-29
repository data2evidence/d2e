import { Controller, Delete, Query } from '@nestjs/common'
import { PrefectDeploymentService } from './prefect-deployment.service'
import { PrefectDeploymentDeletionDto } from './dto'

@Controller()
export class PrefectDeploymentController {
  constructor(private readonly prefectDeploymentService: PrefectDeploymentService) {}

  @Delete()
  async deleteDeployment(@Query() prefectDeploymentDeletionDto: PrefectDeploymentDeletionDto) {
    return await this.prefectDeploymentService.deleteDeploymentResource(prefectDeploymentDeletionDto)
  }
}
