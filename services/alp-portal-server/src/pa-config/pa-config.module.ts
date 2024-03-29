import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HttpModule } from '@nestjs/axios'
import { PatientAnalyticsConfigController } from './pa-config.controller'
import { PatientAnalyticsConfigService } from './pa-config.service'
import { Dataset } from '../dataset/entity'
import { PaConfigApi } from './pa-config.api'

@Module({
  controllers: [PatientAnalyticsConfigController],
  providers: [PatientAnalyticsConfigService, PaConfigApi],
  imports: [TypeOrmModule.forFeature([Dataset]), HttpModule],
  exports: [PaConfigApi, PatientAnalyticsConfigService]
})
export class PaConfigModule {}
