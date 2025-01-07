import { Test, TestingModule } from '@nestjs/testing'
import { PrefectService } from './prefect.service'
import { MinioClient } from '../minio/minio.client'
import { minioClientMockFactory } from '../minio/minio.mock'

describe('PrefectService', () => {
  let service: PrefectService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrefectService, { provide: MinioClient, useFactory: minioClientMockFactory }]
    }).compile()

    service = module.get<PrefectService>(PrefectService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
