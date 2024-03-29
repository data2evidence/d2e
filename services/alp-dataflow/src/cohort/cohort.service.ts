import { Injectable, Scope } from '@nestjs/common'
import { PrefectAPI } from '../prefect/prefect.api'
import { CohortGeneratorFlowRunDto } from './dto'
import { PrefectDeploymentName, PrefectFlowName } from '../common/const'

@Injectable({ scope: Scope.REQUEST })
export class CohortService {
  constructor(private readonly prefectApi: PrefectAPI) {}

  async createCohortGeneratorFlowRun(cohortGeneratorFlowRunDto: CohortGeneratorFlowRunDto) {
    const flowName = PrefectFlowName.COHORT
    const deploymentName = PrefectDeploymentName.COHORT
    const parameters = cohortGeneratorFlowRunDto
    const flowRunId = await this.prefectApi.createFlowRun(
      `Generate Cohort ${parameters.options.cohortJson.name}`,
      deploymentName,
      flowName,
      parameters
    )
    return { flowRunId }
  }
}
