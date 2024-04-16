import { AnalysisflowService } from './analysis-flow.service'
import { MockType } from 'test/type.mock'

export const analysisflowServiceMockFactory: () => MockType<AnalysisflowService> = jest.fn(() => ({
  getDataflow: jest.fn()
}))
