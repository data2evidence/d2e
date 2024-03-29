import { SharedPortalApi } from './shared-portal.api'
import { MockType } from 'test/type.mock'

export const sharedPortalApiMockFactory: () => MockType<SharedPortalApi> = jest.fn(() => ({
  getStudy: jest.fn()
}))
