import { Module } from '@nestjs/common';
import { ConceptSetService } from './concept-set.service';
import { ConceptSetController } from './concept-set.controller';
import { ConceptModule } from '../concept/concept.module';
@Module({
  imports: [ConceptModule],
  controllers: [ConceptSetController],
  exports: [ConceptSetModule],
  providers: [ConceptSetService],
})
export class ConceptSetModule {}
