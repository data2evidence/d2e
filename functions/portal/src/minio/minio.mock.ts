import { MinioClient } from './minio.client'
import { MockType } from 'test/type.mock'

export const minioClientMockFactory: () => MockType<MinioClient> = jest.fn(() => ({
  list: jest.fn()
}))
