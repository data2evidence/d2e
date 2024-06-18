import { Injectable } from '@nestjs/common'
import { filter, uniqBy } from 'lodash'
import { PrefectAPI } from '../prefect/prefect.api'
import { DataCharacterizationFlowRunDto } from './dto'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { AnalyticsSvcAPI } from '../analytics-svc/analytics-svc.api'
import { PrefectDeploymentName, PrefectTagNames } from '../common/const'
import { FLOW_RUN_STATE_TYPES } from '../common/const'

interface DataCharacterizationOptions {
  comment: string
  datasetId: string
  releaseId: string
  schemaName: string
  releaseDate: string
  databaseCode: string
  resultsSchema: string
  vocabSchemaName: string
  cdmVersionNumber: string
}

@Injectable()
export class DataCharacterizationService {
  constructor(
    private readonly prefectApi: PrefectAPI,
    private readonly portalServerApi: PortalServerAPI,
    private readonly analyticsSvcApi: AnalyticsSvcAPI
  ) {}

  async getDataCharacterizationResults(flowRunId: string, sourceKey: string) {
    const dcFlowRun = await this.prefectApi.getFlowRun(flowRunId)
    const dcFlowRunOptions: DataCharacterizationOptions = dcFlowRun.parameters.options
    const { resultsSchema, databaseCode, vocabSchemaName, datasetId } = dcFlowRunOptions

    return this.analyticsSvcApi.getDataCharacterizationResults(
      databaseCode,
      resultsSchema,
      sourceKey,
      vocabSchemaName,
      datasetId
    )
  }

  async getDataCharacterizationResultsDrilldown(flowRunId: string, sourceKey: string, conceptId: string) {
    const dcFlowRun = await this.prefectApi.getFlowRun(flowRunId)
    const dcFlowRunOptions: DataCharacterizationOptions = dcFlowRun.parameters.options
    const { resultsSchema, databaseCode, vocabSchemaName, datasetId } = dcFlowRunOptions

    return this.analyticsSvcApi.getDataCharacterizationResultsDrilldown(
      databaseCode,
      resultsSchema,
      sourceKey,
      conceptId,
      vocabSchemaName,
      datasetId
    )
  }

  async createDataCharacterizationFlowRun(dataCharacterizationFlowRunDto: DataCharacterizationFlowRunDto) {
    const dcFlowName = dataCharacterizationFlowRunDto.flowName
    const dcDeploymentName = dataCharacterizationFlowRunDto.deploymentName
    const datasetId = dataCharacterizationFlowRunDto.datasetId
    const comment = dataCharacterizationFlowRunDto.comment
    const releaseId = dataCharacterizationFlowRunDto.releaseId
    const excludeAnalysisIds = dataCharacterizationFlowRunDto.excludeAnalysisIds ?? ''

    const { dialect, databaseCode, schemaName, vocabSchemaName } = await this.portalServerApi.getDataset(datasetId)

    const dataCharacterizationResultsSchema = `${schemaName}_DATA_CHARACTERIZATION_${Date.now()}`

    const releaseDate = (await this.getReleaseDate(releaseId)).split('T')[0]

    const cdmVersionNumber = await this.analyticsSvcApi.getCdmVersion(dialect, databaseCode, schemaName)

    const name = `${databaseCode}.${schemaName}`
    const parameters = {
      options: {
        schemaName,
        databaseCode,
        datasetId,
        cdmVersionNumber,
        vocabSchemaName,
        comment,
        resultsSchema: dataCharacterizationResultsSchema,
        excludeAnalysisIds,
        releaseId,
        releaseDate
      }
    }

    return this.prefectApi.createFlowRun(name, dcDeploymentName, dcFlowName, parameters)
  }

  async getLatestDataCharacterizationFlowRun(datasetId: string) {
    const { schemaName, databaseCode } = await this.portalServerApi.getDataset(datasetId)

    const flowRuns = await this.prefectApi.getFlowRunsByDataset(
      databaseCode,
      schemaName,
      PrefectTagNames.DATA_CHARACTERIZATION
    )

    if (flowRuns.length === 0) {
      return null
    }

    return flowRuns[0]
  }

  async getSchemaMappingList() {
    const dcFlowRuns = await this.prefectApi.getFlowRunsByDeploymentNames([PrefectDeploymentName.DATA_CHARACTERIZATION])

    const completedDcFlowRuns = filter(dcFlowRuns, { state_type: FLOW_RUN_STATE_TYPES.COMPLETED })
    const uniqueDcFlowRunsBySchemaName = uniqBy(completedDcFlowRuns, 'parameters.options.schemaName')

    const schemaMapping = uniqueDcFlowRunsBySchemaName.map(dcFlowRun => {
      const dcFlowRunOptions: DataCharacterizationOptions = dcFlowRun.parameters.options
      return { [dcFlowRunOptions.schemaName]: dcFlowRunOptions.resultsSchema }
    })
    return schemaMapping
  }

  async getReleaseFlowRun(datasetId: string, releaseId: number) {
    const { schemaName, databaseCode } = await this.portalServerApi.getDataset(datasetId)
    const flowRuns = await this.prefectApi.getFlowRunsByDataset(
      databaseCode,
      schemaName,
      PrefectTagNames.DATA_CHARACTERIZATION
    )
    return flowRuns.find(run => run.parameters.options.releaseId === releaseId.toString())
  }

  private async getReleaseDate(releaseId: string): Promise<string> {
    if (releaseId) {
      const datasetRelease = await this.portalServerApi.getDatasetReleaseById(releaseId)
      return datasetRelease.releaseDate
    }
    return new Date().toISOString()
  }
}
