import { Controller, Get } from "@danet/core";
import { SystemService } from "./system.service.ts";

@Controller("system-portal/system")
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get("feature/list")
  async getSystemFeatures() {
    return await this.systemService.getSystemFeatures();
  }
}
