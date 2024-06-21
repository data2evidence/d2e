import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { OverviewDescriptionService } from './overview-description.service'
import { OverviewDescriptionUpdateDto } from './dto'

@Controller()
export class OverviewDescriptionController {
  constructor(private readonly overviewDescriptionService: OverviewDescriptionService) {}

  @Get()
  async getOverviewDescription() {
    return await this.overviewDescriptionService.getOverviewDescription()
  }

  @Get('public')
  async getPublicOverviewDescription() {
    return await this.overviewDescriptionService.getOverviewDescription()
  }

  @Put()
  async updateOverviewDescription(@Body() overviewDescriptionUpdateDto: OverviewDescriptionUpdateDto) {
    return await this.overviewDescriptionService.updateOverviewDescription(overviewDescriptionUpdateDto)
  }
}
