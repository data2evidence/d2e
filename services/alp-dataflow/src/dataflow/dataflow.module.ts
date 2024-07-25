import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataflowController } from './dataflow.controller'
import { DataflowService } from './dataflow.service'
import { Dataflow, DataflowRevision } from './entity'
import { IsDataflowNameExistConstraint } from './validator'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { PrefectAPI } from '../prefect/prefect.api'
import { UtilsService } from '../utils/utils.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  controllers: [DataflowController],
  providers: [DataflowService, IsDataflowNameExistConstraint, PortalServerAPI, PrefectAPI, UtilsService],
  imports: [TypeOrmModule.forFeature([Dataflow, DataflowRevision]), HttpModule],
  exports: [DataflowService]
})
export class DataflowModule {}
