import { Module } from '@nestjs/common'
import { JobHistoryController } from './job-history.controller'
import { JobHistoryService } from './job-history.service'
import { PrefectModule } from '../prefect/prefect.module'

@Module({
  controllers: [JobHistoryController],
  providers: [JobHistoryService],
  imports: [PrefectModule],
  exports: [JobHistoryService]
})
export class JobHistoryModule {}
