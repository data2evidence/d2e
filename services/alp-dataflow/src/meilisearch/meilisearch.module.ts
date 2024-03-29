import { Module } from '@nestjs/common'
import { MeilisearchController } from './meilisearch.controller'
import { MeilisearchService } from './meilisearch.service'
import { PrefectModule } from '../prefect/prefect.module'
import { PortalServerModule } from '../portal-server/portal-server.module'

@Module({
  imports: [PrefectModule, PortalServerModule],
  controllers: [MeilisearchController],
  providers: [MeilisearchService]
})
export class MeilisearchModule {}
