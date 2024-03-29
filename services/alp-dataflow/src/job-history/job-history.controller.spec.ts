import { Test, TestingModule } from '@nestjs/testing'
import { JobHistoryController } from './job-history.controller'
import { JobHistoryService } from './job-history.service'
import { jobHistoryServiceMockFactory } from './job-history.mock'

describe('JobHistoryController', () => {
  let controller: JobHistoryController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobHistoryController],
      providers: [{ provide: JobHistoryService, useFactory: jobHistoryServiceMockFactory }]
    }).compile()

    controller = module.get<JobHistoryController>(JobHistoryController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
