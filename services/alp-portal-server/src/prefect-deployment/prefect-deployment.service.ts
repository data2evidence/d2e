import { Injectable } from '@nestjs/common'
import { MinioClient } from '../minio/minio.client'

@Injectable()
export class PrefectDeploymentService {
  constructor(private readonly minioClient: MinioClient) {}

  // Delete plugin flow upload files in Minio
  deleteDeploymentResource(fileName: string) {
    return this.minioClient.deleteDeployment(fileName)
  }
}
