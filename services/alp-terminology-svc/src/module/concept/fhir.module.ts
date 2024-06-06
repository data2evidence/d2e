import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { FhirController } from './fhir.controller';
import { HybridSearchConfigService } from '../hybrid-search-config/hybrid-search-config.service';
@Module({
  controllers: [FhirController],
  exports: [FhirModule],
  providers: [ConceptService, HybridSearchConfigService],
})
export class FhirModule {}
