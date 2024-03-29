import { Module } from '@nestjs/common'
import { MinioClient } from './minio.client'

@Module({
  providers: [MinioClient],
  exports: [MinioClient]
})
export class MinioModule {}
