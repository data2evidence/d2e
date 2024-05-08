import { Test, TestingModule } from '@nestjs/testing'
import { MeilisearchService } from './meilisearch.service'
import { PrefectAPI } from '../prefect/prefect.api'
import { prefectApiMockFactory } from '../prefect/prefect.mock'

describe('MeilisearchService', () => {
  let service: MeilisearchService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeilisearchService, { provide: PrefectAPI, useFactory: prefectApiMockFactory }]
    }).compile()

    service = await module.resolve<MeilisearchService>(MeilisearchService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
