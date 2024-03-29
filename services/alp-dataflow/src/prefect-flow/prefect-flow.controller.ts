import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { PrefectFlowService } from './prefect-flow.service'
import { PrefectFlowDto } from './dto'

@Controller()
export class PrefectFlowController {
  constructor(private readonly prefectFlowService: PrefectFlowService) {}

  @Get('list')
  getFlows() {
    return this.prefectFlowService.getFlows()
  }

  @Get(':id/deployment')
  getDeploymentByFlowId(@Param('id', ParseUUIDPipe) id: string) {
    return this.prefectFlowService.getDeploymentByFlowId(id)
  }

  @Delete(':id')
  deleteFlow(@Param('id', ParseUUIDPipe) id: string) {
    return this.prefectFlowService.deleteFlow(id)
  }

  @Post()
  createFlow(@Body() prefectFlowDto: PrefectFlowDto) {
    return this.prefectFlowService.createFlow(prefectFlowDto)
  }
}
