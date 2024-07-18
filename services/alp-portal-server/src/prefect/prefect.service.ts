import { Injectable } from '@nestjs/common'
import { MinioClient } from '../minio/minio.client'
import { PrefectDeploymentDeletionDto, PrefectFlowRunResultDto } from './dto'

@Injectable()
export class PrefectService {
  constructor(private readonly minioClient: MinioClient) {}

  // Delete plugin flow upload files in Minio
  async deleteDeploymentResource(prefectDeploymentDeletionDto: PrefectDeploymentDeletionDto) {
    const { filePath, bucketName } = prefectDeploymentDeletionDto
    return this.minioClient.deleteDeployment(filePath, bucketName)
  }

  // Get flow run result for dqd / dc
  async getFlowRunResults(prefectFlowRunResultDto: PrefectFlowRunResultDto) {
    return this.minioClient.getFlowRunResults(prefectFlowRunResultDto.filePath)
  }
}
