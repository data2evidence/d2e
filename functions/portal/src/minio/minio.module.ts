import { Module } from '@danet/core'
import { MinioClient } from './minio.client.ts'

@Module({
  injectables: [MinioClient]
})
export class MinioModule { }
