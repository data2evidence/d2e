import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataflowController } from './dataflow.controller'
import { DataflowService } from './dataflow.service'
import { Dataflow, DataflowRevision, DataflowResult, DataflowRun } from './entity'
import { IsDataflowNameExistConstraint } from './validator'

@Module({
  controllers: [DataflowController],
  providers: [DataflowService, IsDataflowNameExistConstraint],
  imports: [TypeOrmModule.forFeature([Dataflow, DataflowRevision, DataflowResult, DataflowRun])],
  exports: [DataflowService]
})
export class DataflowModule {}
