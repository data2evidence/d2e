import { Module } from '@nestjs/common'
import { DataCharacterizationController } from './data-characterization.controller'
import { DataCharacterizationService } from './data-characterization.service'
import { PrefectModule } from '../prefect/prefect.module'
import { PortalServerModule } from '../portal-server/portal-server.module'
import { DbSvcModule } from '../db-svc/db-svc.module'
import { AnalyticsSvcModule } from '../analytics-svc/analytics-svc.module'

@Module({
  imports: [PrefectModule, PortalServerModule, DbSvcModule, AnalyticsSvcModule],
  controllers: [DataCharacterizationController],
  providers: [DataCharacterizationService]
})
export class DataCharacterizationModule {}
