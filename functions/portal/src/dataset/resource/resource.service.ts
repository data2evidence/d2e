import { Injectable } from '@danet/core'
import { MinioClient } from '../../minio/minio.client.ts'

@Injectable()
export class ResourceService {
  constructor(private readonly minioClient: MinioClient) {}

  async getResources(datasetId: string) {
    const resources = await this.minioClient.list(datasetId)
    return {
      id: datasetId,
      resources
    }
  }

  downloadResource(datasetId: string, fileName: string) {
    return this.minioClient.download(datasetId, fileName)
  }

  uploadResource(datasetId: string, file: any) {
    return this.minioClient.upload(datasetId, file)
  }

  deleteResource(datasetId: string, fileName: string) {
    return this.minioClient.delete(datasetId, fileName)
  }
}
