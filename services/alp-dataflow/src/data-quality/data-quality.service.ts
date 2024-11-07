import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrefectAPI } from '../prefect/prefect.api'
import { DataQualityFlowRunDto } from './dto'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { AnalyticsSvcAPI } from '../analytics-svc/analytics-svc.api'
import { DqdService } from '../dqd/dqd.service'
import { DataQualityOverviewParser } from './data-quality-overview.parser'
import { DATA_QUALITY_DOMAINS, PrefectTagNames } from '../common/const'
import { createLogger } from '../logger'
import { isDataCharacterizationResult, isDataQualityResult } from '../dqd/typeguard'
import { IDataCharacterizationResult, IDataQualityResult, IDomainContinuityResult } from '../types'

@Injectable()
export class DataQualityService {
  private readonly logger = createLogger(this.constructor.name)
  constructor(
    private readonly dataQualityOverviewParser: DataQualityOverviewParser,
    private readonly prefectApi: PrefectAPI,
    private readonly portalServerApi: PortalServerAPI,
    private readonly analyticsSvcApi: AnalyticsSvcAPI,
    private readonly dqdService: DqdService
  ) {}
  async createDataQualityFlowRun(dataQualityFlowRunDto: DataQualityFlowRunDto) {
    const dqFlowName = dataQualityFlowRunDto.flowName
    const dqDeploymentName = dataQualityFlowRunDto.deploymentName

    const datasetId = dataQualityFlowRunDto.datasetId
    const comment = dataQualityFlowRunDto.comment
    let vocabSchema = dataQualityFlowRunDto.vocabSchemaName
    const releaseId = dataQualityFlowRunDto.releaseId
    const cohortDefinitionId = dataQualityFlowRunDto.cohortDefinitionId

    const { databaseCode, schemaName, vocabSchemaName } = await this.portalServerApi.getDataset(datasetId)

    const releaseDate = (await this.getReleaseDate(releaseId)).split('T')[0]

    if (!vocabSchema) {
      vocabSchema = vocabSchemaName
    }

    const cdmVersionNumber = await this.analyticsSvcApi.getCdmVersion(datasetId)

    const name = `${databaseCode}.${schemaName}`
    const parameters = {
      options: {
        schemaName,
        databaseCode,
        datasetId,
        cdmVersionNumber,
        vocabSchemaName: vocabSchema,
        comment,
        cohortDefinitionId,
        releaseId,
        releaseDate
      }
    }

    return this.prefectApi.createFlowRun(name, dqDeploymentName, dqFlowName, parameters)
  }

  async getDataQualityFlowRunResults(flowRunId: string) {
    const dqdResult = await this.dqdService.getDqdResultByFlowRunId(flowRunId)
    if (isDataQualityResult(dqdResult[0])) {
      return dqdResult[0].CheckResults
    }
    throw new InternalServerErrorException('Invalid DQD results found')
  }

  async getDataQualityFlowRunOverview(flowRunId: string) {
    const checkResults = await this.getDataQualityFlowRunResults(flowRunId)
    return this.dataQualityOverviewParser.parse(checkResults)
  }

  async getLatestDataQualityFlowRun(datasetId: string) {
    const { schemaName, databaseCode } = await this.portalServerApi.getDataset(datasetId)

    const flowRuns = await this.prefectApi.getFlowRunsByDataset(databaseCode, schemaName, PrefectTagNames.DQD)

    // Only get flows that are run without cohortDefinitionId
    const flowRunsWithoutCohort = flowRuns.filter(flowRun => {
      return !flowRun.parameters.options.cohortDefinitionId
    })

    if (flowRunsWithoutCohort.length === 0) {
      return null
    }

    return flowRunsWithoutCohort[0]
  }

  async getLatestDataQualityCohortFlowRun(datasetId: string, cohortDefinitionId: string) {
    const { schemaName, databaseCode } = await this.portalServerApi.getDataset(datasetId)

    const flowRuns = await this.prefectApi.getFlowRunsByDataset(databaseCode, schemaName, PrefectTagNames.DQD)

    const cohortflowRuns = flowRuns.filter(flowRun => {
      return flowRun.parameters.options.cohortDefinitionId === cohortDefinitionId
    })

    if (cohortflowRuns.length === 0) {
      return null
    }

    return cohortflowRuns[0]
  }

  async getReleaseFlowRun(datasetId: string, releaseId: number) {
    const { schemaName, databaseCode } = await this.portalServerApi.getDataset(datasetId)
    const flowRuns = await this.prefectApi.getFlowRunsByDataset(databaseCode, schemaName, PrefectTagNames.DQD)
    return flowRuns.find(run => run.parameters.options.releaseId === releaseId.toString())
  }

  async getDatasetDomainContinuity(datasetId: string) {
    const { schemaName, databaseCode } = await this.portalServerApi.getDataset(datasetId)
    const flowRuns = await this.prefectApi.getFlowRunsByDataset(
      databaseCode,
      schemaName,
      PrefectTagNames.DATA_CHARACTERIZATION
    )
    const flowRunIds = flowRuns.map(run => run.id)
    if (!flowRunIds.length) {
      return []
    }
    const dqdResults = await this.dqdService.getDqdResults({ flowRunIds: flowRunIds })
    const domainIndexes: { [key: string]: number } = {}
    return dqdResults
      .filter(r => {
        return isDataCharacterizationResult(r.result)
      })
      .reduce((acc, r) => {
        const result = r.result as IDataCharacterizationResult
        const continuityResults = this.transformToDomainContinuity(result)
        if (acc.length > 0) {
          continuityResults.forEach(r => {
            const domainIndex = domainIndexes[r.domain]
            acc[domainIndex].records.push(...r.records)
          })
        } else {
          continuityResults.forEach((r, index) => (domainIndexes[r.domain] = index))
          acc = continuityResults
        }
        return acc
      }, [])
  }

  async getDataQualityHistory(datasetId: string) {
    const dataQualityResults = await this.getDatasetDataQualityResults(datasetId)
    return dataQualityResults
      .map(dataQualityResult => {
        return {
          cdmReleaseDate: dataQualityResult.Metadata[0].cdmReleaseDate,
          failed: dataQualityResult.Overview.countOverallFailed[0]
        }
      })
      .sort((a, b) => this.getDateTime(a.cdmReleaseDate) - this.getDateTime(b.cdmReleaseDate))
  }

  async getDataQualityHistoryByCategory(datasetId: string) {
    const dataQualityResults = await this.getDatasetDataQualityResults(datasetId)
    return dataQualityResults
      .map(dataQualityResult => {
        return {
          cdmReleaseDate: dataQualityResult.Metadata[0].cdmReleaseDate,
          failed: {
            completeness: dataQualityResult.Overview.countFailedCompleteness[0],
            conformness: dataQualityResult.Overview.countFailedConformance[0],
            plausibility: dataQualityResult.Overview.countFailedPlausibility[0]
          }
        }
      })
      .sort((a, b) => this.getDateTime(a.cdmReleaseDate) - this.getDateTime(b.cdmReleaseDate))
  }

  async getDataQualityHistoryByDomain(datasetId: string) {
    const dataQualityResults = await this.getDatasetDataQualityResults(datasetId)
    return dataQualityResults
      .map(dataQualityResult => {
        const domainFailures = dataQualityResult.CheckResults.reduce((acc, cr) => {
          if (DATA_QUALITY_DOMAINS.includes(cr.cdmTableName)) {
            acc[cr.cdmTableName] = cr.failed
          } else {
            this.logger.warn(`Data quality check results does not contain CDM table name: ${JSON.stringify(cr)}`)
          }
          return acc
        }, {})
        return {
          cdmReleaseDate: dataQualityResult.Metadata[0].cdmReleaseDate,
          failed: {
            ...domainFailures
          }
        }
      })
      .sort((a, b) => this.getDateTime(a.cdmReleaseDate) - this.getDateTime(b.cdmReleaseDate))
  }

  private async getDatasetDataQualityResults(datasetId: string) {
    const { schemaName, databaseCode } = await this.portalServerApi.getDataset(datasetId)
    const flowRuns = await this.prefectApi.getFlowRunsByDataset(databaseCode, schemaName, PrefectTagNames.DQD)
    const flowRunIds = flowRuns.map(run => run.id)
    const dqdResults = await this.dqdService.getDqdResults({ flowRunIds: flowRunIds })

    return dqdResults
      .filter(r => {
        return isDataQualityResult(r)
      })
      .map(r => r as IDataQualityResult)
  }

  private transformToDomainContinuity(result: IDataCharacterizationResult) {
    const aresResult = result.exportToAres
    const domainsRecords = aresResult['records-by-domain']
    const domainIndexes: { [key: string]: number } = {}
    return domainsRecords.reduce<IDomainContinuityResult[]>((acc, record) => {
      const domain = record.domain
      const cdmReleaseDate = aresResult.cdmReleaseDate
      const newCount = {
        cdmReleaseDate: `${cdmReleaseDate.substring(0, 4)}-${cdmReleaseDate.substring(4, 6)}-${cdmReleaseDate.substring(
          6
        )}`,
        count: record.countRecords
      }
      if (domainIndexes.hasOwnProperty(domain)) {
        const domainRecord = acc[domainIndexes[domain]]
        domainRecord.records.push(newCount)
      } else {
        domainIndexes[domain] = acc.length
        acc.push({
          domain,
          records: [newCount]
        })
      }
      return acc
    }, [])
  }

  private getDateTime(dateValue: string) {
    return dateValue ? new Date(dateValue).getTime() : 0
  }

  private async getReleaseDate(releaseId: string): Promise<string> {
    if (releaseId) {
      const datasetRelease = await this.portalServerApi.getDatasetReleaseById(releaseId)
      return datasetRelease.releaseDate
    }
    return new Date().toISOString()
  }
}
