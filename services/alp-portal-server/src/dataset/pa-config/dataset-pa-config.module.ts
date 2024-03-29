import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatasetPaConfigController } from './dataset-pa-config.controller'
import { DatasetPaConfigService } from './dataset-pa-config.service'
import { PaConfigModule } from '../../pa-config/pa-config.module'
import { Dataset } from '../entity'

const imports: Array<Type<any> | DynamicModule> = [PaConfigModule, TypeOrmModule.forFeature([Dataset])]

const providers: Provider[] = [DatasetPaConfigService]
@Module({
  imports,
  controllers: [DatasetPaConfigController],
  providers
})
export class DatasetPaConfigModule {}
