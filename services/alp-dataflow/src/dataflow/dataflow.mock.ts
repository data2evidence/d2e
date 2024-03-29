import { DataflowService } from './dataflow.service'
import { MockType } from 'test/type.mock'

export const dataflowServiceMockFactory: () => MockType<DataflowService> = jest.fn(() => ({
  getDataflow: jest.fn()
}))
