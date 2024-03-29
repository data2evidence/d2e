import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PublicDatasetController } from './public-dataset.controller'
import { PublicDatasetQueryService } from './public-dataset-query.service'
import { TenantModule } from '../../tenant/tenant.module'
import { Dataset, DatasetAttribute } from '../entity'
import { DatasetAttributeRepository, DatasetRepository } from '../repository'

const imports: Array<Type<any> | DynamicModule> = [TenantModule, TypeOrmModule.forFeature([Dataset, DatasetAttribute])]

const providers: Provider[] = [PublicDatasetQueryService, DatasetRepository, DatasetAttributeRepository]
@Module({
  imports,
  controllers: [PublicDatasetController],
  providers
})
export class PublicDatasetModule {}
