import { DataSource } from 'typeorm'
import { MockType } from './type.mock'

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(() => ({
  initialize: jest.fn(),
  createQueryRunner: jest.fn()
}))
