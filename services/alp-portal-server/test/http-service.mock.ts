import { HttpService } from '@nestjs/axios'
import { MockType } from './type.mock'

export const httpServiceMockFactory: () => MockType<HttpService> = jest.fn(() => ({
  post: jest.fn()
}))
