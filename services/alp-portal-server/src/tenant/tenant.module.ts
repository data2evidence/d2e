import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { TenantController } from './tenant.controller'
import { TenantService } from './tenant.service'

const imports: Array<Type<any> | DynamicModule> = []
const providers: Provider[] = [TenantService]
const exportProviders: Array<Provider> = [TenantService]

@Module({
  controllers: [TenantController],
  providers,
  imports,
  exports: exportProviders
})
export class TenantModule {}
