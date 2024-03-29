import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { AnalyticsSvcAPI } from './analytics-svc.api'

@Module({ imports: [HttpModule], providers: [AnalyticsSvcAPI], exports: [AnalyticsSvcAPI] })
export class AnalyticsSvcModule {}
