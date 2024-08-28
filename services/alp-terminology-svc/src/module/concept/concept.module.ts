import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { ConceptController } from './concept.controller';
import { HybridSearchConfigService } from '../hybrid-search-config/hybrid-search-config.service';
@Module({
  controllers: [ConceptController],
  exports: [ConceptModule],
  providers: [ConceptService, HybridSearchConfigService],
})
export class ConceptModule {}
