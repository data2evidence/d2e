import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatasetController } from './dataset.controller'
import { DatasetQueryService } from './query/dataset-query.service'
import { DatasetFilterService } from './dataset-filter.service'
import { DatasetCommandService } from './command/dataset-command.service'
import { SharedPortalModule } from '../shared-portal/shared-portal.module'
import { Dataset, DatasetDashboard, DatasetDetail, DatasetAttribute, DatasetTag, DatasetRelease } from './entity'
import { Notebook } from '../notebook/entity'
import { env } from '../env'
import { TenantModule } from '../tenant/tenant.module'
import { AnalyticsModule } from '../analytics/analytics.module'
import { UserMgmtModule } from '../user-mgmt/user-mgmt.module'
import {
  DatasetDetailRepository,
  DatasetDashboardRepository,
  DatasetAttributeRepository,
  DatasetReleaseRepository,
  DatasetRepository,
  DatasetTagRepository,
  DatasetAttributeConfigRepository
} from './repository'
import { IsDatasetAttributeValueValid } from './validator/dataset-attribute.validator'
import { TransactionRunner } from '../common/data-source/transaction-runner'

const isProxy = env.APP_DEPLOY_MODE === 'proxy'
const imports: Array<Type<any> | DynamicModule> = [
  TenantModule,
  AnalyticsModule,
  UserMgmtModule,
  TypeOrmModule.forFeature([
    Dataset,
    DatasetDashboard,
    DatasetDetail,
    DatasetAttribute,
    DatasetTag,
    DatasetRelease,
    Notebook
  ])
]
const providers: Provider[] = [
  DatasetQueryService,
  DatasetCommandService,
  DatasetFilterService,
  DatasetRepository,
  DatasetDetailRepository,
  DatasetDashboardRepository,
  DatasetAttributeRepository,
  DatasetAttributeConfigRepository,
  DatasetTagRepository,
  DatasetReleaseRepository,
  IsDatasetAttributeValueValid,
  TransactionRunner
]

if (isProxy) {
  imports.push(SharedPortalModule)
}

@Module({
  imports,
  controllers: [DatasetController],
  providers
})
export class DatasetModule {}
