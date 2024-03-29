import { REQUEST } from '@nestjs/core'
import { Injectable, Inject, Scope } from '@nestjs/common'
import { PrefectAPI } from '../prefect/prefect.api'
import { MeilisearchAddIndexFlowRunDto } from './dto'
import { PrefectDeploymentName, PrefectFlowName } from '../common/const'

@Injectable({ scope: Scope.REQUEST })
export class MeilisearchService {
  private readonly jwt: string
  constructor(@Inject(REQUEST) request: Request, private readonly prefectApi: PrefectAPI) {
    this.jwt = request.headers['authorization']
  }

  async createAddIndexFlowRun(meilisearchAddIndexFlowRunDto: MeilisearchAddIndexFlowRunDto) {
    const flowName = PrefectFlowName.MEILISEARCH_ADD_INDEX
    const deploymentName = PrefectDeploymentName.MEILISEARCH_ADD_INDEX
    const token = this.jwt
    const databaseCode = meilisearchAddIndexFlowRunDto.databaseCode
    const vocabSchemaName = meilisearchAddIndexFlowRunDto.vocabSchemaName
    const tableName = meilisearchAddIndexFlowRunDto.tableName
    const parameters = {
      options: {
        databaseCode,
        vocabSchemaName,
        tableName,
        token
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
