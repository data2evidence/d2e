import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { FhirController } from './fhir.controller';
@Module({
  controllers: [FhirController],
  exports: [FhirModule],
  providers: [ConceptService],
})
export class FhirModule {}
