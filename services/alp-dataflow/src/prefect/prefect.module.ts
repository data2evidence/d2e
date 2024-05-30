import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { PrefectController } from './prefect.controller'
import { PrefectService } from './prefect.service'
import { PrefectAPI } from './prefect.api'
import { PrefectParamsTransformer } from './prefect-params.transformer'
import { DataflowModule } from '../dataflow/dataflow.module'
import { PrefectExecutionClient } from './prefect-execution.client'
import { PrefectFlowService } from '../prefect-flow/prefect-flow.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FlowMetadata } from '../prefect-flow/entity'
import { DataQualityModule } from '../data-quality/data-quality.module'
import { PortalServerModule } from '../portal-server/portal-server.module'

@Module({
  imports: [
    HttpModule,
    DataflowModule,
    DataQualityModule,
    PortalServerModule,
    TypeOrmModule.forFeature([FlowMetadata])
  ],
  controllers: [PrefectController],
  providers: [PrefectService, PrefectAPI, PrefectParamsTransformer, PrefectExecutionClient, PrefectFlowService],
  exports: [PrefectAPI]
})
export class PrefectModule {}
