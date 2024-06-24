import { Body, Controller, Get, Param, Put } from '@nestjs/common'
import { ConfigService } from './config.service'
import { ConfigUpdateDto } from './dto'

@Controller()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get(':type')
  async getConfigByType(@Param('type') type) {
    return await this.configService.getConfigByType(type)
  }

  @Get('public/:type')
  async getPublicConfigByType(@Param('type') type) {
    return await this.configService.getConfigByType(type)
  }

  @Put()
  async updateConfig(@Body() overviewDescriptionUpdateDto: ConfigUpdateDto) {
    return await this.configService.updateConfig(overviewDescriptionUpdateDto)
  }
}
