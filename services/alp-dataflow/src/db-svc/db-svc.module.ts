import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { DBSvcController } from './db-svc.controller'
import { DBSvcService } from './db-svc.service'
import { PrefectAPI } from '../prefect/prefect.api'

@Module({
  imports: [HttpModule],
  controllers: [DBSvcController],
  providers: [DBSvcService, PrefectAPI]
})
export class DbSvcModule {}
