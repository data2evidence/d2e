import { Injectable, Inject, Scope } from '@nestjs/common'
import { PrefectAPI } from '../prefect/prefect.api'
import { DBSvcFlowRunDto, DatasetAttributesFlowRunDto } from './dto'
import { PrefectDeploymentName, PrefectFlowName } from '../common/const'
import { createLogger } from '../logger'
import { REQUEST } from '@nestjs/core'

@Injectable({ scope: Scope.REQUEST })
export class DBSvcService {
  private readonly logger = createLogger(this.constructor.name)
  private readonly jwt: string
  constructor(@Inject(REQUEST) request: Request, private readonly prefectApi: PrefectAPI) {
    this.jwt = request.headers['authorization']
  }

  async createDbSvcFlowRun(dbSvcFlowRunDto: DBSvcFlowRunDto) {
    const dbSvcFlowName = PrefectFlowName.DB_SVC
    const dbSvcDeploymentName = PrefectDeploymentName.DB_SVC
    const flowRunName = dbSvcFlowRunDto.dbSvcOperation
    const requestType = dbSvcFlowRunDto.requestType
    const requestUrl = dbSvcFlowRunDto.requestUrl
    const requestBody = dbSvcFlowRunDto.requestBody

    const parameters = {
      options: {
        requestType,
        requestUrl,
        requestBody
      }
    }
    return this.prefectApi.createFlowRun(flowRunName, dbSvcDeploymentName, dbSvcFlowName, parameters)
  }

  async updateDatasetAttributes(datasetAttributesDto: DatasetAttributesFlowRunDto) {
    const flowName = PrefectFlowName.DATASET_ATTRIBUTE
    const deploymentName = PrefectDeploymentName.DATASET_ATTRIBUTE
    const versionInfo = datasetAttributesDto.versionInfo
    const datasetSchemaMapping = datasetAttributesDto.datasetSchemaMapping

    const parameters = {
      options: {
        token: this.jwt,
        versionInfo: versionInfo,
        datasetSchemaMapping: datasetSchemaMapping
      }
    }
    return this.prefectApi.createFlowRun('update_dataset_attributes', deploymentName, flowName, parameters)
  }
}
