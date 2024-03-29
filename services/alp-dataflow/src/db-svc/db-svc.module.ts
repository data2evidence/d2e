import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { DBSvcController } from './db-svc.controller'
import { DBSvcService } from './db-svc.service'
import { PrefectModule } from '../prefect/prefect.module'

@Module({
  imports: [PrefectModule, HttpModule],
  controllers: [DBSvcController],
  providers: [DBSvcService]
})
export class DbSvcModule {}
