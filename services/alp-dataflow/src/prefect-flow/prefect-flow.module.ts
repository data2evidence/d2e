import { Module } from '@nestjs/common'
import { PrefectFlowController } from './prefect-flow.controller'
import { PrefectFlowService } from './prefect-flow.service'
import { PrefectModule } from '../prefect/prefect.module'
import { PortalServerModule } from '../portal-server/portal-server.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FlowMetadata } from './entity'

@Module({
  imports: [PrefectModule, PortalServerModule, TypeOrmModule.forFeature([FlowMetadata])],
  controllers: [PrefectFlowController],
  providers: [PrefectFlowService]
})
export class PrefectFlowModule {}
