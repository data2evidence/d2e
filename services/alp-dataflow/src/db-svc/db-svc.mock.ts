import { DBSvcService } from './db-svc.service'
import { MockType } from 'test/type.mock'

export const dbSvcServiceMockFactory: () => MockType<DBSvcService> = jest.fn(() => ({
  createDbSvcFlowRun: jest.fn()
}))
