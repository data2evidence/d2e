import { Injectable } from '@nestjs/common'
import { PrefectAPI } from '../prefect/prefect.api'
import { MeilisearchAddIndexFlowRunDto } from './dto'
import { PrefectDeploymentName, PrefectFlowName } from '../common/const'

@Injectable()
export class MeilisearchService {
  constructor(private readonly prefectApi: PrefectAPI) {}

  async createAddIndexFlowRun(meilisearchAddIndexFlowRunDto: MeilisearchAddIndexFlowRunDto) {
    const flowName = PrefectFlowName.MEILISEARCH_ADD_INDEX
    const deploymentName = PrefectDeploymentName.MEILISEARCH_ADD_INDEX
    const databaseCode = meilisearchAddIndexFlowRunDto.databaseCode
    const vocabSchemaName = meilisearchAddIndexFlowRunDto.vocabSchemaName
    const tableName = meilisearchAddIndexFlowRunDto.tableName
    const parameters = {
      options: {
        databaseCode,
        vocabSchemaName,
        tableName
      }
    }

    const flowRunId = await this.prefectApi.createFlowRun(
      `Meilisearch Add Index: ${databaseCode}_${vocabSchemaName}_${tableName}`,
      deploymentName,
      flowName,
      parameters
    )
    return { flowRunId }
  }
}
