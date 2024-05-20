import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { PrefectController } from './prefect.controller'
import { PrefectService } from './prefect.service'
import { PrefectAPI } from './prefect.api'
import { PrefectParamsTransformer } from './prefect-params.transformer'
import { PrefectAnalysisParamsTransformer } from './prefect-analysis-params.transformer'
import { DataflowModule } from '../dataflow/dataflow.module'
import { AnalysisflowModule } from '../analysis-flow/analysis-flow.module'
import { PrefectExecutionClient } from './prefect-execution.client'
import { PrefectFlowService } from '../prefect-flow/prefect-flow.service'
// import { AnalysisflowService } from 'src/analysis-flow/analysis-flow.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FlowMetadata } from '../prefect-flow/entity'
import { DataQualityModule } from '../data-quality/data-quality.module'

@Module({
  imports: [
    HttpModule,
    DataflowModule,
    AnalysisflowModule,
    DataQualityModule,
    TypeOrmModule.forFeature([FlowMetadata])
  ],
  controllers: [PrefectController],
  providers: [
    PrefectService,
    PrefectAPI,
    PrefectParamsTransformer,
    PrefectAnalysisParamsTransformer,
    PrefectExecutionClient,
    PrefectFlowService
  ],
  exports: [PrefectAPI]
})
export class PrefectModule {}
