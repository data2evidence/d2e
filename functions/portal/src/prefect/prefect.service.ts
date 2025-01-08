import { Injectable, InternalServerErrorException } from '@danet/core'
import { MinioClient } from '../minio/minio.client.ts'
import { PrefectFlowRunResultDto } from './dto/index.ts'

@Injectable()
export class PrefectService {
  constructor(private readonly minioClient: MinioClient) { }

  // Get flow run result
  async getFlowRunResults(prefectFlowRunResultDto: PrefectFlowRunResultDto) {
    if (prefectFlowRunResultDto.filePath) {
      return this.minioClient.getFlowRunResults(prefectFlowRunResultDto.filePath)
    } else if (prefectFlowRunResultDto.filePaths) {
      return this.minioClient.getMultipleFlowRunResults(prefectFlowRunResultDto.filePaths)
    }
    throw new InternalServerErrorException('File path is not defined for DQD flow run results')
  }
}
