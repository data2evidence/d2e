import { TenantService } from './tenant.service'
import { MockType } from 'test/type.mock'

export const tenantServiceMockFactory: () => MockType<TenantService> = jest.fn(() => ({
  getTenants: jest.fn(),
  getTenant: jest.fn()
}))
