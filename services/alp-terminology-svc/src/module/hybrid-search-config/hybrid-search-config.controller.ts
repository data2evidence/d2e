import { Body, Controller, Get, Post } from '@nestjs/common';
import { HybridSearchConfigService } from './hybrid-search-config.service';
import { HybridSearchConfigDto } from './dto/hybrid-search-config.dto';

@Controller()
export class HybridSearchConfigController {
  constructor(
    private readonly hybridSearchConfigService: HybridSearchConfigService,
  ) {}

  @Get()
  async getHybridSearchConfig() {
    return await this.hybridSearchConfigService.getHybridSearchConfig();
  }

  @Post()
  async setHybridSearchConfig(
    @Body() hybridSearchConfig: HybridSearchConfigDto,
  ) {
    return await this.hybridSearchConfigService.setHybridSearchConfig(
      hybridSearchConfig,
    );
  }
}
