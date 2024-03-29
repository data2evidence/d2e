import { Module } from '@nestjs/common'
import { CohortController } from './cohort.controller'
import { CohortService } from './cohort.service'
import { PrefectModule } from '../prefect/prefect.module'
import { PortalServerModule } from '../portal-server/portal-server.module'
import { DbSvcModule } from '../db-svc/db-svc.module'
import { AnalyticsSvcModule } from '../analytics-svc/analytics-svc.module'

@Module({
  imports: [PrefectModule, PortalServerModule, DbSvcModule, AnalyticsSvcModule],
  controllers: [CohortController],
  providers: [CohortService]
})
export class CohortModule {}
