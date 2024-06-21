import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OverviewDescription } from './entity'
import { OverviewDescriptionService } from './overview-description.service'
import { OverviewDescriptionController } from './overview-description.controller'

const imports: Array<Type<any> | DynamicModule> = [TypeOrmModule.forFeature([OverviewDescription])]
const providers: Provider[] = [OverviewDescriptionService]
@Module({
  imports,
  controllers: [OverviewDescriptionController],
  providers
})
export class OverviewDescriptionModule {}
