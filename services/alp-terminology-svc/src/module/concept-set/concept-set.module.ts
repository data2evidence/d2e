import { Module } from '@nestjs/common';
import { ConceptSetService } from './concept-set.service';
import { ConceptSetController } from './concept-set.controller';
import { ConceptModule } from '../concept/concept.module';
import { CachedbModule } from 'src/module/cachedb/cachedb.module';
@Module({
  imports: [ConceptModule, CachedbModule],
  controllers: [ConceptSetController],
  exports: [ConceptSetModule],
  providers: [ConceptSetService],
})
export class ConceptSetModule {}
