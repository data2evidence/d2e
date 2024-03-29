import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { AnalyticsApi } from './analytics.api'

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AnalyticsApi],
  exports: [AnalyticsApi]
})
export class AnalyticsModule {}
