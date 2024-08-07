import { Module } from '@nestjs/common'
import { DqdService } from './dqd.service'
import { PrefectAPI } from '../prefect/prefect.api'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { UtilsService } from '../utils/utils.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  providers: [DqdService, PrefectAPI, PortalServerAPI, UtilsService],
  imports: [HttpModule],
  exports: [DqdService]
})
export class DqdModule {}
