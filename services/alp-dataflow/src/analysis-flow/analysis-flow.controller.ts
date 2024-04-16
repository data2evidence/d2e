import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Delete } from '@nestjs/common'
import { AnalysisflowService } from './analysis-flow.service'
import { AnalysisflowDto, DataflowDuplicateDto } from './dto'

@Controller('analysisflow')
export class AnalysisflowController {
  constructor(private readonly dataflowService: AnalysisflowService) {}

  @Get('list')
  getDataflows() {
    return this.dataflowService.getDataflows()
  }

  @Get(':id')
  getDataflow(@Param('id', ParseUUIDPipe) id: string) {
    return this.dataflowService.getDataflow(id)
  }

  @Get(':id/latest')
  getDataflowRevision(@Param('id', ParseUUIDPipe) id: string) {
    return this.dataflowService.getLastDataflowRevision(id)
  }

  @Delete(':id')
  deleteDataflow(@Param('id', ParseUUIDPipe) id: string) {
    return this.dataflowService.deleteDataflow(id)
  }

  @Get('task-run-result/:taskRunId')
  getTaskRunResult(@Param('taskRunId', ParseUUIDPipe) taskRunId: string) {
    return this.dataflowService.getTaskRunResult(taskRunId)
  }

  @Get('/:dataflowId/flow-run-results')
  getFlowRunResults(@Param('dataflowId', ParseUUIDPipe) dataflowId: string) {
    return this.dataflowService.getFlowRunResultsByDataflowId(dataflowId)
  }

  @Post()
  createDataflow(@Body() dataflowDto: AnalysisflowDto) {
    return this.dataflowService.createDataflow(dataflowDto)
  }

  @Post('duplicate/:id/:revisionId')
  duplicateDataflow(
    @Param('id', ParseUUIDPipe) flowId: string,
    @Param('revisionId', ParseUUIDPipe) revisionId: string,
    @Body() dataflowDuplicateDto: DataflowDuplicateDto
  ) {
    return this.dataflowService.duplicateDataflow(flowId, revisionId, dataflowDuplicateDto)
  }

  @Delete(':id/:revisionId')
  deleteDataflowRevision(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('revisionId', ParseUUIDPipe) revisionId: string
  ) {
    return this.dataflowService.deleteDataflowRevision(id, revisionId)
  }
}
