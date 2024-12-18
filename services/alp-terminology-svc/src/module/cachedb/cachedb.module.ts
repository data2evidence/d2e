import { Module } from '@nestjs/common';
import { CachedbService } from './cachedb.service';
import { APIModule } from 'src/api/api.module';

@Module({
  imports: [APIModule],
  providers: [CachedbService],
  exports: [CachedbService],
})
export class CachedbModule {}
