import { Test, TestingModule } from '@nestjs/testing'
import { CohortController } from './cohort.controller'
import { CohortService } from './cohort.service'
import { cohortServiceMockFactory } from './cohort.mock'

describe('CohortController', () => {
  let controller: CohortController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CohortController],
      providers: [{ provide: CohortService, useFactory: cohortServiceMockFactory }]
    }).compile()

    controller = module.get<CohortController>(CohortController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
