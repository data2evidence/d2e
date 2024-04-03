import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataflowController } from './analysis-flow.controller'
import { DataflowService } from './analysis-flow.service'
import { Analysisflow, AnalysisflowRevision, AnalysisflowResult, AnalysisflowRun } from './entity'
import { IsDataflowNameExistConstraint } from './validator'

@Module({
  controllers: [DataflowController],
  providers: [DataflowService, IsDataflowNameExistConstraint],
  imports: [TypeOrmModule.forFeature([Analysisflow, AnalysisflowRevision, AnalysisflowResult, AnalysisflowRun])],
  exports: [DataflowService]
})
export class AnalysisflowModule {}
