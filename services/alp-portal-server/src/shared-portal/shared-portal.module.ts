import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { SharedPortalApi } from './shared-portal.api'

@Module({
  imports: [HttpModule],
  providers: [SharedPortalApi],
  exports: [SharedPortalApi]
})
export class SharedPortalModule {}
