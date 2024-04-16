import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AnalysisflowController } from './analysis-flow.controller'
import { AnalysisflowService } from './analysis-flow.service'
import { Analysisflow, AnalysisflowRevision, AnalysisflowResult, AnalysisflowRun } from './entity'
import { IsDataflowNameExistConstraint } from './validator'

@Module({
  controllers: [AnalysisflowController],
  providers: [AnalysisflowService, IsDataflowNameExistConstraint],
  imports: [TypeOrmModule.forFeature([Analysisflow, AnalysisflowRevision, AnalysisflowResult, AnalysisflowRun])],
  exports: [AnalysisflowService]
})
export class AnalysisflowModule {}
