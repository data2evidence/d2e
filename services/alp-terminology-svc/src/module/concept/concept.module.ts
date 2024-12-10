import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { ConceptController } from './concept.controller';
import { CachedbModule } from 'src/module/cachedb/cachedb.module';
@Module({
  imports: [CachedbModule],
  controllers: [ConceptController],
  exports: [ConceptService],
  providers: [ConceptService],
})
export class ConceptModule {}
