import { Test, TestingModule } from '@nestjs/testing'
import { JobHistoryService } from './job-history.service'
import { PrefectAPI } from '../prefect/prefect.api'
import { jobHistoryServiceMockFactory } from './job-history.mock'

describe('JobHistoryService', () => {
  let service: JobHistoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobHistoryService, { provide: PrefectAPI, useFactory: jobHistoryServiceMockFactory }]
    }).compile()

    service = module.get<JobHistoryService>(JobHistoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
