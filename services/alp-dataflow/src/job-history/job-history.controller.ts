import { Controller, Get, Query } from '@nestjs/common'
import { transformPipe } from '../common/pipe/TransformPipe'
import { JobHistoryService } from './job-history.service'
import { JobHistoryQueryDto } from './dto/job-history.query.dto'

@Controller()
export class JobHistoryController {
  constructor(private readonly jobHistoryService: JobHistoryService) {}

  @Get('flow-runs')
  getFlowRuns(@Query(transformPipe) queryParams: JobHistoryQueryDto) {
    return this.jobHistoryService.getJobHistory(queryParams)
  }
}
