import { Controller, Post, Body, Get, Param, ParseUUIDPipe } from '@nestjs/common'
import { CohortSurvivalService } from './cohort-survival.service'
import { CohortSurvivalFlowRunDto } from './dto'

@Controller()
export class CohortSurvivalController {
  constructor(private readonly cohortSurvivalService: CohortSurvivalService) {}

  @Post('flow-run')
  createCohortSurvivalFlowRun(@Body() cohortSurvivalFlowRunDto: CohortSurvivalFlowRunDto) {
    return this.cohortSurvivalService.createCohortSurvivalFlowRun(cohortSurvivalFlowRunDto)
  }

  @Get('results/:flowRunId')
  getCohortSurvivalResults(@Param('flowRunId', ParseUUIDPipe) flowRunId: string) {
    return this.cohortSurvivalService.getCohortSurvivalResults(flowRunId)
  }
}
