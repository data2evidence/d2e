import { DynamicModule, Module, Type } from '@nestjs/common'
import { MinioModule } from '../../minio/minio.module'
import { ResourceController } from './resource.controller'
import { ResourceService } from './resource.service'

const imports: Array<Type<any> | DynamicModule> = [MinioModule]
@Module({
  imports,
  controllers: [ResourceController],
  providers: [ResourceService]
})
export class ResourceModule {}
