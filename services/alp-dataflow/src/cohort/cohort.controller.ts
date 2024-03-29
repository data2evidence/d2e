import { Controller, Post, Body } from '@nestjs/common'
import { CohortService } from './cohort.service'
import { CohortGeneratorFlowRunDto } from './dto'

@Controller()
export class CohortController {
  constructor(private readonly cohortService: CohortService) {}

  @Post('flow-run')
  createCohortGeneratorFlowRun(@Body() cohortGeneratorFlowRunDto: CohortGeneratorFlowRunDto) {
    return this.cohortService.createCohortGeneratorFlowRun(cohortGeneratorFlowRunDto)
  }
}
