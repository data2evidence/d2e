import { Controller, Get, Post, Param, Body, ParseUUIDPipe, ParseIntPipe } from '@nestjs/common'
import { DataCharacterizationService } from './data-characterization.service'
import { DataCharacterizationFlowRunDto } from './dto'

@Controller()
export class DataCharacterizationController {
  constructor(private readonly dataCharacterizationService: DataCharacterizationService) {}

  @Get('flow-run/:flowRunId/results/:sourceKey')
  getDataCharacterizationResults(
    @Param('flowRunId', ParseUUIDPipe) flowRunId: string,
    @Param('sourceKey') sourceKey: string
  ) {
    return this.dataCharacterizationService.getDataCharacterizationResults(flowRunId, sourceKey)
  }

  @Get('flow-run/:flowRunId/results/:sourceKey/:conceptId')
  getDataCharacterizationResultsDrilldown(
    @Param('flowRunId', ParseUUIDPipe) flowRunId: string,
    @Param('sourceKey') sourceKey: string,
    @Param('conceptId') conceptId: string
  ) {
    return this.dataCharacterizationService.getDataCharacterizationResultsDrilldown(flowRunId, sourceKey, conceptId)
  }

  @Get('dataset/:datasetId/flow-run/latest')
  getLatestDataCharacterizationFlowRun(@Param('datasetId', ParseUUIDPipe) datasetId: string) {
    return this.dataCharacterizationService.getLatestDataCharacterizationFlowRun(datasetId)
  }

  @Get('dataset/:datasetId/release/:releaseId/flow-run')
  getReleaseFlowRun(
    @Param('datasetId', ParseUUIDPipe) datasetId: string,
    @Param('releaseId', ParseIntPipe) releaseId: number
  ) {
    return this.dataCharacterizationService.getReleaseFlowRun(datasetId, releaseId)
  }

  @Post('flow-run')
  createDataCharacterizationFlowRun(@Body() dataCharacterizationFlowRunDto: DataCharacterizationFlowRunDto) {
    return this.dataCharacterizationService.createDataCharacterizationFlowRun(dataCharacterizationFlowRunDto)
  }

  @Get('schema-mapping/list')
  getSchemaMappingList() {
    return this.dataCharacterizationService.getSchemaMappingList()
  }
}
