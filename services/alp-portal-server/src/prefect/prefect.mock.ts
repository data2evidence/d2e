import { MockType } from 'test/type.mock'
import { PrefectService } from './prefect.service'

export const prefectServiceMockFactory: () => MockType<PrefectService> = jest.fn(() => ({
  deleteDeploymentResource: jest.fn()
}))
