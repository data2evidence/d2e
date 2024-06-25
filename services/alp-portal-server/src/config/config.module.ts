import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Config } from './entity'
import { ConfigService } from './config.service'
import { ConfigController } from './config.controller'

const imports: Array<Type<any> | DynamicModule> = [TypeOrmModule.forFeature([Config])]
const providers: Provider[] = [ConfigService]
@Module({
  imports,
  controllers: [ConfigController],
  providers
})
export class ConfigModule {}
