import { Injectable } from '@nestjs/common'
import { MinioClient } from '../minio/minio.client'
import { PrefectDeploymentDeletionDto } from './dto'

@Injectable()
export class PrefectDeploymentService {
  constructor(private readonly minioClient: MinioClient) {}

  // Delete plugin flow upload files in Minio
  deleteDeploymentResource(prefectDeploymentDeletionDto: PrefectDeploymentDeletionDto) {
    const { filePath, bucketName } = prefectDeploymentDeletionDto
    return this.minioClient.deleteDeployment(filePath, bucketName)
  }
}
