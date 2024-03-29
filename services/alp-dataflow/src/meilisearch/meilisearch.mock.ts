import { MeilisearchService } from './meilisearch.service'
import { MockType } from 'test/type.mock'

export const meilisearchServiceMockFactory: () => MockType<MeilisearchService> = jest.fn(() => ({
  createAddIndexFlowRun: jest.fn()
}))
