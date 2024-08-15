import { UtilsService } from './utils.service'
import { MockType } from 'test/type.mock'

export const utilsSvcMockFactory: () => MockType<UtilsService> = jest.fn(() => ({
  regexMatcher: jest.fn(),
  extractRelativePath: jest.fn()
}))
