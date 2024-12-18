import { Module } from '@nestjs/common';
import { ConceptSetService } from './concept-set.service';
import { ConceptSetController } from './concept-set.controller';
import { CachedbModule } from 'src/module/cachedb/cachedb.module';
import { APIModule } from 'src/api/api.module';
@Module({
  imports: [CachedbModule, APIModule],
  controllers: [ConceptSetController],
  exports: [ConceptSetModule],
  providers: [ConceptSetService],
})
export class ConceptSetModule {}
