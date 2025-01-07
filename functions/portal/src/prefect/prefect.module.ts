import { Module } from '@danet/core'
import { MinioModule } from '../minio/minio.module.ts'
import { PrefectController } from './prefect.controller.ts'
import { PrefectService } from './prefect.service.ts'

@Module({
  imports: [MinioModule],
  controllers: [PrefectController],
  injectables: [PrefectService]
})
export class PrefectModule { }
