import { Injectable, BadRequestException } from '@nestjs/common'
import { PrefectAPI } from '../prefect/prefect.api'
import { IHistoryJob, IJobHistoryQueryDto } from '../types'
import { PrefectDeploymentName } from '../common/const'

@Injectable()
export class JobHistoryService {
  constructor(private readonly prefectApi: PrefectAPI) {}

  async getJobHistory({ filter, ...params }: IJobHistoryQueryDto) {
    let flowRuns
    switch (filter) {
      case 'dqd':
        flowRuns = await this.prefectApi.getFlowRunsByDeploymentNames(
          [PrefectDeploymentName.DQD, PrefectDeploymentName.DATA_CHARACTERIZATION],
          params
        )
        break

      case 'all':
        flowRuns = await this.prefectApi.getAllFlowRuns(params)
        break

      default:
        throw new BadRequestException(`Invalid param: ${filter}`)
    }

    const mappedFlowRuns = flowRuns.map(obj => mapFlowRunResultsToHistoryTable(obj))

    return mappedFlowRuns
  }
}

const mapFlowRunResultsToHistoryTable = (result: any): IHistoryJob => {
  const mappedResult: IHistoryJob = {
    flowRunId: result.id,
    flowRunName: result.name,
    schemaName: result.parameters.options?.schemaName,
    dataCharacterizationSchema: result.parameters.options?.resultsSchema,
    cohortDefinitionId: result.parameters.options?.cohortDefinitionId,
    type: result.tags,
    createdAt: result.start_time,
    completedAt: result.end_time,
    status: result.state_name,
    error: '',
    datasetId: result.parameters.options?.datasetId,
    comment: result.parameters.options?.comment,
    databaseCode: result.parameters.options?.databaseCode
  }

  return mappedResult
}
