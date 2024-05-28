import { Controller, Delete, Query } from '@nestjs/common'
import { PrefectDeploymentService } from './prefect-deployment.service'

@Controller()
export class PrefectDeploymentController {
  constructor(private readonly prefectDeploymentService: PrefectDeploymentService) {}

  @Delete()
  async deleteDeployment(@Query('filePath') filePath: string) {
    // use decodeURLComponent to decode path contains slashs
    const decodedFilePath = decodeURIComponent(filePath)
    return await this.prefectDeploymentService.deleteDeploymentResource(decodedFilePath)
  }
}
