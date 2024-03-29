import { Body, Controller, Get, Post } from '@nestjs/common'
import { FeatureService } from './feature.service'
import { FeatureUpdateDto } from './dto/feature.update.dto'

@Controller()
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get('list')
  async getFeatures() {
    return await this.featureService.getFeatures()
  }

  @Post()
  async setFeature(@Body() featureDto: FeatureUpdateDto) {
    return await this.featureService.setFeature(featureDto)
  }
}
