import { DqdService } from './dqd.service'
import { MockType } from 'test/type.mock'

export const dqdServiceMockFactory: () => MockType<DqdService> = jest.fn(() => ({}))
