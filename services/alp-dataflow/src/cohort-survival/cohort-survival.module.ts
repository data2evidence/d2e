import { Module } from '@nestjs/common'
import { CohortSurvivalController } from './cohort-survival.controller'
import { CohortSurvivalService } from './cohort-survival.service'
import { PrefectModule } from '../prefect/prefect.module'
import { PortalServerModule } from '../portal-server/portal-server.module'
import { DbSvcModule } from '../db-svc/db-svc.module'
import { AnalyticsSvcModule } from '../analytics-svc/analytics-svc.module'

@Module({
  imports: [PrefectModule, PortalServerModule, DbSvcModule, AnalyticsSvcModule],
  controllers: [CohortSurvivalController],
  providers: [CohortSurvivalService]
})
export class CohortSurvivalModule {}
