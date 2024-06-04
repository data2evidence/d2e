import { MockType } from 'test/type.mock'
import { PrefectDeploymentService } from './prefect-deployment.service'

export const prefectDeploymentServiceMockFactory: () => MockType<PrefectDeploymentService> = jest.fn(() => ({
  deleteDeploymentResource: jest.fn()
}))
