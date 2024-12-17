import { Test, TestingModule } from '@nestjs/testing'
import { MinioClient } from './minio.client'

jest.mock('minio', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      createBucket: jest.fn()
    })
  }
})

describe('MinioClient', () => {
  let client: MinioClient

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinioClient]
    }).compile()

    client = module.get<MinioClient>(MinioClient)
  })

  it('should be defined', () => {
    expect(client).toBeDefined()
  })
})
