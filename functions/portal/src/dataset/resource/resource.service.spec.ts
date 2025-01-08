import { Test, TestingModule } from '@nestjs/testing'
import { ResourceService } from './resource.service'
import { MinioClient } from '../../minio/minio.client'
import { minioClientMockFactory } from '../../minio/minio.mock'

describe('ResourceService', () => {
  let service: ResourceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceService, { provide: MinioClient, useFactory: minioClientMockFactory }]
    }).compile()

    service = module.get<ResourceService>(ResourceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
