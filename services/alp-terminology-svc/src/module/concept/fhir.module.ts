import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { FhirController } from './fhir.controller';
import { CachedbModule } from 'src/module/cachedb/cachedb.module';
@Module({
  imports: [CachedbModule],
  controllers: [FhirController],
  exports: [FhirModule],
  providers: [ConceptService],
})
export class FhirModule {}
