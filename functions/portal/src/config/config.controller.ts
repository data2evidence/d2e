import { Body, Controller, Get, Param, Put, Middleware } from '@danet/core'
import { RequestContextMiddleware } from '../common/request-context.middleware.ts'
import { ConfigService } from './config.service.ts'
import { ConfigUpdateDto } from './dto/config.update.dto.ts'

@Middleware(RequestContextMiddleware)
@Controller("config")
export class ConfigController {
  constructor(private readonly configService: ConfigService) { }

  @Get(':type')
  async getConfigByType(@Param('type') type: string) {
    return await this.configService.getConfigByType(type)
  }

  @Get('public/:type')
  async getPublicConfigByType(@Param('type') type: string) {
    return await this.configService.getConfigByType(type)
  }

  @Put()
  async updateConfig(@Body() overviewDescriptionUpdateDto: ConfigUpdateDto, request: any) {
    return await this.configService.updateConfig(overviewDescriptionUpdateDto)
  }
}
