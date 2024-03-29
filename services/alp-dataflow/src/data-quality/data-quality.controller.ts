import { Controller, Get, Post, Param, Body, ParseUUIDPipe, ParseIntPipe } from '@nestjs/common'
import { DataQualityService } from './data-quality.service'
import { DataQualityFlowRunDto } from './dto'

@Controller()
export class DataQualityController {
  constructor(private readonly dataQualityService: DataQualityService) {}

  @Get('flow-run/:flowRunId/results')
  getDataQualityFlowRunResults(@Param('flowRunId', ParseUUIDPipe) flowRunId: string) {
    return this.dataQualityService.getDataQualityFlowRunResults(flowRunId)
  }

  @Get('flow-run/:flowRunId/overview')
  getDataQualityFlowRunOverview(@Param('flowRunId', ParseUUIDPipe) flowRunId: string) {
    return this.dataQualityService.getDataQualityFlowRunOverview(flowRunId)
  }

  @Get('dataset/:datasetId/flow-run/latest')
  getLatestDataQualityFlowRun(@Param('datasetId', ParseUUIDPipe) datasetId: string) {
    return this.dataQualityService.getLatestDataQualityFlowRun(datasetId)
  }

  @Get('dataset/:datasetId/cohort/:cohortDefinitionId/flow-run/latest')
  getLatestDataQualityCohortFlowRun(
    @Param('datasetId', ParseUUIDPipe) datasetId: string,
    @Param('cohortDefinitionId') cohortDefinitionId: string
  ) {
    return this.dataQualityService.getLatestDataQualityCohortFlowRun(datasetId, cohortDefinitionId)
  }

  @Get('dataset/:datasetId/release/:releaseId/flow-run')
  getReleaseFlowRun(
    @Param('datasetId', ParseUUIDPipe) datasetId: string,
    @Param('releaseId', ParseIntPipe) releaseId: number
  ) {
    return this.dataQualityService.getReleaseFlowRun(datasetId, releaseId)
  }

  @Post('flow-run')
  createDataQualityFlowRun(@Body() dataQualityFlowRunDto: DataQualityFlowRunDto) {
    return this.dataQualityService.createDataQualityFlowRun(dataQualityFlowRunDto)
  }

  @Get('dataset/:datasetId/history')
  getDataQualityHistory(@Param('datasetId', ParseUUIDPipe) datasetId: string) {
    return this.dataQualityService.getDataQualityHistory(datasetId)
  }

  @Get('dataset/:datasetId/category/history')
  getDataQualityHistoryByCategory(@Param('datasetId', ParseUUIDPipe) datasetId: string) {
    return this.dataQualityService.getDataQualityHistoryByCategory(datasetId)
  }

  @Get('dataset/:datasetId/domain/history')
  getDataQualityHistoryByDomain(@Param('datasetId', ParseUUIDPipe) datasetId: string) {
    return this.dataQualityService.getDataQualityHistoryByDomain(datasetId)
  }

  @Get('dataset/:datasetId/domain/continuity')
  getDomainContinuity(@Param('datasetId', ParseUUIDPipe) datasetId: string) {
    return this.dataQualityService.getDatasetDomainContinuity(datasetId)
  }
}
