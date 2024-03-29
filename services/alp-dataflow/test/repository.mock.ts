import { Repository } from 'typeorm'
import { MockType } from './type.mock'

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  createQueryBuilder: jest.fn()
}))
