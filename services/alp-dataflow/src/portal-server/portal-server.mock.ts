import { PortalServerAPI } from './portal-server.api'
import { MockType } from 'test/type.mock'

export const portalApiMockFactory: () => MockType<PortalServerAPI> = jest.fn(() => ({
  getDatasetReleaseById: jest.fn()
}))
