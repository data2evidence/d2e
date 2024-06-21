import { MockType } from 'test/type.mock'
import { OverviewDescriptionService } from './overview-description.service'

export const overviewDescriptionMockFactory: () => MockType<OverviewDescriptionService> = jest.fn(() => ({
  getOverviewDescription: jest.fn()
}))
