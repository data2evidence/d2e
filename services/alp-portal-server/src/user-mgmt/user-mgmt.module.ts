import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { UserMgmtService } from './user-mgmt.service'
import { UserMgmtApi } from './user-mgmt.api'

@Module({
  providers: [UserMgmtService, UserMgmtApi],
  imports: [HttpModule],
  exports: [UserMgmtService]
})
export class UserMgmtModule {}
