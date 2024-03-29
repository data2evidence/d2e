import { Module } from '@nestjs/common'
import { FeatureController } from './feature.controller'
import { FeatureService } from './feature.service'
import { FeatureRepository } from './repository/feature.repository'
import { TransactionRunner } from '../common/data-source/transaction-runner'

@Module({
  controllers: [FeatureController],
  providers: [FeatureService, FeatureRepository, TransactionRunner]
})
export class FeatureModule {}
