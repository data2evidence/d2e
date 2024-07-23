import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DqdService } from './dqd.service'
import { DqdResult } from './entity'
import { PrefectAPI } from '../prefect/prefect.api'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { HttpModule } from '@nestjs/axios'

@Module({
  providers: [DqdService, PrefectAPI, PortalServerAPI],
  imports: [TypeOrmModule.forFeature([DqdResult]), HttpModule],
  exports: [DqdService]
})
export class DqdModule {}
