import { Injectable, InternalServerErrorException } from '@nestjs/common'
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
    if (prefectFlowRunResultDto.filePath) {
      return this.minioClient.getFlowRunResults(prefectFlowRunResultDto.filePath)
    } else if (prefectFlowRunResultDto.filePaths) {
      return this.minioClient.getMultipleFlowRunResults(prefectFlowRunResultDto.filePaths)
    }
    throw new InternalServerErrorException('File path is not defined for DQD flow run results')
  }
}
