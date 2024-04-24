import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Delete } from '@nestjs/common'
import { AnalysisflowService } from './analysis-flow.service'
import { AnalysisflowDto, AnalysisflowDuplicateDto } from './dto'

@Controller('analysisflow')
export class AnalysisflowController {
  constructor(private readonly analysisflowService: AnalysisflowService) {}

  @Get('list')
  getAnalysisflows() {
    return this.analysisflowService.getAnalysisflows()
  }

  @Get(':id')
  getAnalysisflow(@Param('id', ParseUUIDPipe) id: string) {
    return this.analysisflowService.getAnalysisflow(id)
  }

  @Get(':id/latest')
  getAnalysisflowRevision(@Param('id', ParseUUIDPipe) id: string) {
    return this.analysisflowService.getLastAnalysisflowRevision(id)
  }

  @Delete(':id')
  deleteAnalysisflow(@Param('id', ParseUUIDPipe) id: string) {
    return this.analysisflowService.deleteAnalysisflow(id)
  }

  @Get('task-run-result/:taskRunId')
  getTaskRunResult(@Param('taskRunId', ParseUUIDPipe) taskRunId: string) {
    return this.analysisflowService.getTaskRunResult(taskRunId)
  }

  @Get('/:analysisflowId/flow-run-results')
  getFlowRunResults(@Param('analysisflowId', ParseUUIDPipe) analysisflowId: string) {
    return this.analysisflowService.getFlowRunResultsByAnalysisflowId(analysisflowId)
  }

  @Post()
  createAnalysisflow(@Body() analysisflowDto: AnalysisflowDto) {
    return this.analysisflowService.createAnalysisflow(analysisflowDto)
  }

  @Post('duplicate/:id/:revisionId')
  duplicateAnalysisflow(
    @Param('id', ParseUUIDPipe) flowId: string,
    @Param('revisionId', ParseUUIDPipe) revisionId: string,
    @Body() analysisflowDuplicateDto: AnalysisflowDuplicateDto
  ) {
    return this.analysisflowService.duplicateAnalysisflow(flowId, revisionId, analysisflowDuplicateDto)
  }

  @Delete(':id/:revisionId')
  deleteAnalysisflowRevision(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('revisionId', ParseUUIDPipe) revisionId: string
  ) {
    return this.analysisflowService.deleteAnalysisflowRevision(id, revisionId)
  }
}
