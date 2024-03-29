import { DataCharacterizationService } from './data-characterization.service'
import { MockType } from 'test/type.mock'

export const dataCharacterizationServiceMockFactory: () => MockType<DataCharacterizationService> = jest.fn(() => ({
  getDataCharacterizationResults: jest.fn(),
  getDataCharacterizationResultsDrilldown: jest.fn(),
  createDataCharacterizationFlowRun: jest.fn(),
  getLatestDataCharacterizationFlowRun: jest.fn()
}))
