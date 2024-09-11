import { Module } from '@nestjs/common';
import { CachedbService } from './cachedb.service';

@Module({
  providers: [CachedbService],
  exports: [CachedbService],
})
export class CachedbModule {}
