import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { ConceptController } from './concept.controller';
import { HybridSearchConfigService } from '../hybrid-search-config/hybrid-search-config.service';
import { CachedbModule } from 'src/cachedb/cachedb.module';
@Module({
  imports: [CachedbModule],
  controllers: [ConceptController],
  exports: [ConceptService],
  providers: [ConceptService, HybridSearchConfigService],
})
export class ConceptModule {}
