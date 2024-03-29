import { Controller, Get, Query } from '@nestjs/common'
import { JobHistoryService } from './job-history.service'
import { ParseValuePipe } from '../common/pipe/ParseValuePipe'

@Controller()
export class JobHistoryController {
  constructor(private readonly jobHistoryService: JobHistoryService) {}

  @Get('flow-runs')
  getFlowRuns(@Query('filter', new ParseValuePipe({ allowedValues: ['dqd', 'all'] })) filter: string) {
    return this.jobHistoryService.getJobHistory(filter)
  }
}
