import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatasetAttribute, DatasetTagConfig } from '../entity'
import { MetadataConfigController } from './metadata-config.controller'
import { MetadataConfigService } from './metadata-config.service'
import { DatasetTagConfigRepository, DatasetAttributeConfigRepository } from '../repository'

const imports: Array<Type<any> | DynamicModule> = [TypeOrmModule.forFeature([DatasetAttribute, DatasetTagConfig])]
const providers: Provider[] = [MetadataConfigService, DatasetTagConfigRepository, DatasetAttributeConfigRepository]
@Module({
  imports,
  controllers: [MetadataConfigController],
  providers
})
export class MetadataConfigModule {}
