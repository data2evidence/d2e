import { DataQualityService } from './data-quality.service'
import { DataQualityOverviewParser } from './data-quality-overview.parser'
import { MockType } from 'test/type.mock'

export const dataQualityServiceMockFactory: () => MockType<DataQualityService> = jest.fn(() => ({
  createDataQualityFlowRun: jest.fn(),
  getDataQualityFlowRunResults: jest.fn(),
  getDataQualityFlowRunOverview: jest.fn(),
  getLatestDataQualityFlowRun: jest.fn(),
  getDataQualityHistory: jest.fn()
}))

export const dataQualityOverviewParserMockFactory: () => MockType<DataQualityOverviewParser> = jest.fn(() => ({
  parse: jest.fn()
}))
