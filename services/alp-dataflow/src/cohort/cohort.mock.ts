import { CohortService } from './cohort.service'
import { MockType } from 'test/type.mock'

export const cohortServiceMockFactory: () => MockType<CohortService> = jest.fn(() => ({
  createCohortGeneratorFlowRun: jest.fn()
}))
