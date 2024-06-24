import { Injectable, Scope } from '@nestjs/common'
import { PrefectAPI } from '../prefect/prefect.api'
import { CohortSurvivalFlowRunDto } from './dto'
import { FlowRunState, PrefectDeploymentName, PrefectFlowName } from '../common/const'

@Injectable({ scope: Scope.REQUEST })
export class CohortSurvivalService {
  constructor(private readonly prefectApi: PrefectAPI) {}

  async createCohortSurvivalFlowRun(cohortSurvivalFlowRunDto: CohortSurvivalFlowRunDto) {
    const flowName = PrefectFlowName.COHORT_SURVIVAL
    const deploymentName = PrefectDeploymentName.COHORT_SURVIVAL
    const parameters = cohortSurvivalFlowRunDto
    const flowRunId = await this.prefectApi.createFlowRun(
      `Run Kaplan Meier analysis`,
      deploymentName,
      flowName,
      parameters
    )
    return { flowRunId }
  }

  async getCohortSurvivalResults(flowRunId: string) {
    const flowRun: FlowRunState = await this.prefectApi.getFlowRun(flowRunId)
    return flowRun
  }
}
