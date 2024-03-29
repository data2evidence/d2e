import { PrefectFlowService } from './prefect-flow.service'
import { MockType } from 'test/type.mock'

export const prefectFlowServiceMockFactory: () => MockType<PrefectFlowService> = jest.fn(() => ({
  getFlows: jest.fn()
}))
