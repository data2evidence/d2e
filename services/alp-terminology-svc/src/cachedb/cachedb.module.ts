import { Module } from '@nestjs/common';
import { CachedbService } from './cachedb.service';

@Module({
  providers: [CachedbService],
})
export class CachedbModule {}
