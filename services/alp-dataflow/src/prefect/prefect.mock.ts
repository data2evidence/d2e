import { PrefectParamsTransformer } from './prefect-params.transformer'
import { PrefectAPI } from './prefect.api'
import { PrefectService } from './prefect.service'
import { PrefectExecutionClient } from './prefect-execution.client'
import { MockType } from 'test/type.mock'

export const prefectServiceMockFactory: () => MockType<PrefectService> = jest.fn(() => ({
  createDataflowFlowRun: jest.fn()
}))

export const prefectApiMockFactory: () => MockType<PrefectAPI> = jest.fn(() => ({
  createFlowRun: jest.fn()
}))

export const prefectParamsTransformerMockFactory: () => MockType<PrefectParamsTransformer> = jest.fn(() => ({
  transform: jest.fn()
}))

export const prefectExecutionClientMockFactory: () => MockType<PrefectExecutionClient> = jest.fn(() => ({
  executePythonPrefectModule: jest.fn()
}))
