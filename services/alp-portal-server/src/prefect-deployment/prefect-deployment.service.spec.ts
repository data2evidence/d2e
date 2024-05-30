import { Test, TestingModule } from '@nestjs/testing'
import { PrefectDeploymentService } from './prefect-deployment.service'
import { MinioClient } from '../minio/minio.client'
import { minioClientMockFactory } from '../minio/minio.mock'

describe('PrefectDeploymentService', () => {
  let service: PrefectDeploymentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrefectDeploymentService, { provide: MinioClient, useFactory: minioClientMockFactory }]
    }).compile()

    service = module.get<PrefectDeploymentService>(PrefectDeploymentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
