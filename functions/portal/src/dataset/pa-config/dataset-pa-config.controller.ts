import { BadRequestException, Controller, Get, Query } from "@danet/core";
import { DatasetPaConfigService } from "./dataset-pa-config.service.ts";

@Controller("system-portal/dataset/pa-config")
export class DatasetPaConfigController {
  constructor(
    private readonly datasetPaConfigService: DatasetPaConfigService
  ) {}

  @Get("backend")
  async getDatasetBackendPaConfig(@Query("datasetId") id: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException("Invalid datasetId");
    }
    return await this.datasetPaConfigService.getDatasetBackendPaConfig(id);
  }

  @Get("me")
  async getMyDatasetPaConfig(@Query("datasetId") id: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException("Invalid datasetId");
    }
    return await this.datasetPaConfigService.getMyDatasetPaConfig(id);
  }
}
