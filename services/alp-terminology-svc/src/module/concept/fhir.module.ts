import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { FhirController } from './fhir.controller';
import { HybridSearchConfigService } from '../hybrid-search-config/hybrid-search-config.service';
import { CachedbModule } from 'src/module/cachedb/cachedb.module';
@Module({
  imports: [CachedbModule],
  controllers: [FhirController],
  exports: [FhirModule],
  providers: [ConceptService, HybridSearchConfigService],
})
export class FhirModule {}
