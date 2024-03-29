import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { PortalServerAPI } from './portal-server.api'
@Module({ imports: [HttpModule], providers: [PortalServerAPI], exports: [PortalServerAPI] })
export class PortalServerModule {}
