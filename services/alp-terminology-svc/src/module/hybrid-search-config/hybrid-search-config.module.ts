import { Module } from '@nestjs/common';
import { HybridSearchConfigController } from './hybrid-search-config.controller';
import { HybridSearchConfigService } from './hybrid-search-config.service';

@Module({
  controllers: [HybridSearchConfigController],
  exports: [HybridSearchConfigModule],
  providers: [HybridSearchConfigService],
})
export class HybridSearchConfigModule {}
