import { Module } from '@nestjs/common';
import { ConceptSetService } from './concept-set.service';
import { ConceptSetController } from './concept-set.controller';
@Module({
  controllers: [ConceptSetController],
  exports: [ConceptSetModule],
  providers: [ConceptSetService],
})
export class ConceptSetModule {}
