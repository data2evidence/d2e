import { AnalyticsSvcAPI } from './analytics-svc.api'
import { MockType } from 'test/type.mock'

export const analyticsSvcApiMockFactory: () => MockType<AnalyticsSvcAPI> = jest.fn(() => ({
  getDataCharacterizationResults: jest.fn(),
  getDataCharacterizationResultsDrilldown: jest.fn()
}))
