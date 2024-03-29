import { Controller, Post, Body } from '@nestjs/common'
import { MeilisearchService } from './meilisearch.service'
import { MeilisearchAddIndexFlowRunDto } from './dto'

@Controller()
export class MeilisearchController {
  constructor(private readonly meilisearchService: MeilisearchService) {}

  @Post('index/flow-run')
  createAddIndexFlowRun(@Body() meilisearchAddIndexFlowRunDto: MeilisearchAddIndexFlowRunDto) {
    return this.meilisearchService.createAddIndexFlowRun(meilisearchAddIndexFlowRunDto)
  }
}
