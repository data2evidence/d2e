import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SystemPortalAPI } from './portal-api';
import { MeilisearchAPI } from './meilisearch-api';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [SystemPortalAPI, MeilisearchAPI],
  exports: [SystemPortalAPI, MeilisearchAPI],
})
export class APIModule {}
