import { Body, Controller, Get, Middleware, Param, Put } from "@danet/core";
import { RequestContextMiddleware } from "../common/request-context.middleware.ts";
import { ConfigService } from "./config.service.ts";
import { ConfigUpdateDto } from "./dto/config.update.dto.ts";

@Middleware(RequestContextMiddleware)
@Controller("system-portal/config")
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get(":type")
  async getConfigByType(@Param("type") type: string) {
    return await this.configService.getConfigByType(type);
  }

  @Get("public/:type")
  async getPublicConfigByType(@Param("type") type: string) {
    return await this.configService.getConfigByType(type);
  }

  @Put()
  async updateConfig(@Body() overviewDescriptionUpdateDto: ConfigUpdateDto) {
    return await this.configService.updateConfig(overviewDescriptionUpdateDto);
  }
}
