import { Controller, Post, Body } from '@nestjs/common'
import { CohortSurvivalService } from './cohort-survival.service'
import { CohortSurvivalGeneratorFlowRunDto } from './dto'

@Controller()
export class CohortSurvivalController {
  constructor(private readonly cohortSurvivalService: CohortSurvivalService) {}

  @Post('flow-run')
  createCohortSurvivalFlowRun(@Body() cohortSurvivalFlowRunDto: CohortSurvivalGeneratorFlowRunDto) {
    return this.cohortSurvivalService.createCohortSurvivalFlowRun(cohortSurvivalFlowRunDto)
  }
}
