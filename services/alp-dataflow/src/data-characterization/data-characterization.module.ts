import { Module } from '@nestjs/common'
import { DataCharacterizationController } from './data-characterization.controller'
import { DataCharacterizationService } from './data-characterization.service'
import { PortalServerModule } from '../portal-server/portal-server.module'
import { DbSvcModule } from '../db-svc/db-svc.module'
import { AnalyticsSvcModule } from '../analytics-svc/analytics-svc.module'
import { PrefectAPI } from '../prefect/prefect.api'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [PortalServerModule, DbSvcModule, AnalyticsSvcModule, HttpModule],
  controllers: [DataCharacterizationController],
  providers: [DataCharacterizationService, PrefectAPI],
  exports: [DataCharacterizationService]
})
export class DataCharacterizationModule {}
