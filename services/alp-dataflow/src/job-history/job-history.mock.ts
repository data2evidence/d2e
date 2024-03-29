import { JobHistoryService } from './job-history.service'
import { MockType } from 'test/type.mock'

export const jobHistoryServiceMockFactory: () => MockType<JobHistoryService> = jest.fn(() => ({
  getJobHistory: jest.fn()
}))
