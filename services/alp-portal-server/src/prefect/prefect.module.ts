import { DynamicModule, Module, Type } from '@nestjs/common'
import { MinioModule } from '../minio/minio.module'
import { PrefectController } from './prefect.controller'
import { PrefectService } from './prefect.service'

const imports: Array<Type<any> | DynamicModule> = [MinioModule]
@Module({
  imports,
  controllers: [PrefectController],
  providers: [PrefectService]
})
export class PrefectModule {}
