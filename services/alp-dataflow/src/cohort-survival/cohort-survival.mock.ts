import { CohortSurvivalService } from './cohort-survival.service'
import { MockType } from 'test/type.mock'

export const cohortSurvivalServiceMockFactory: () => MockType<CohortSurvivalService> = jest.fn(() => ({
  createCohortSurvivalFlowRun: jest.fn()
}))
