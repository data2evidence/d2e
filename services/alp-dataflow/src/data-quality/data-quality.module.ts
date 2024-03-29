import { Module } from '@nestjs/common'
import { DataQualityController } from './data-quality.controller'
import { DataQualityService } from './data-quality.service'
import { DataQualityOverviewParser } from './data-quality-overview.parser'
import { PortalServerModule } from '../portal-server/portal-server.module'
import { DqdModule } from '../dqd/dqd.module'
import { DataflowModule } from '../dataflow/dataflow.module'
import { AnalyticsSvcModule } from '../analytics-svc/analytics-svc.module'
import { PrefectAPI } from '../prefect/prefect.api'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [DqdModule, PortalServerModule, DataflowModule, AnalyticsSvcModule, HttpModule],
  controllers: [DataQualityController],
  providers: [DataQualityService, DataQualityOverviewParser, PrefectAPI],
  exports: [DataQualityService]
})
export class DataQualityModule {}
