import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { ConceptController } from './concept.controller';
@Module({
  controllers: [ConceptController],
  exports: [ConceptModule],
  providers: [ConceptService],
})
export class ConceptModule {}
