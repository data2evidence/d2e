import { Module } from '@danet/core'
import { MinioModule } from '../../minio/minio.module.ts'
import { ResourceController } from './resource.controller.ts'
import { ResourceService } from './resource.service.ts'

const imports = [MinioModule]
@Module({
  imports,
  controllers: [ResourceController],
  injectables: [ResourceService]
})
export class ResourceModule {}
