import { Test, TestingModule } from '@nestjs/testing'
import { CohortSurvivalController } from './cohort-survival.controller'
import { CohortSurvivalService } from './cohort-survival.service'
import { cohortSurvivalServiceMockFactory } from './cohort-survival.mock'

describe('CohortSurvivalController', () => {
  let controller: CohortSurvivalController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CohortSurvivalController],
      providers: [{ provide: CohortSurvivalService, useFactory: cohortSurvivalServiceMockFactory }]
    }).compile()

    controller = module.get<CohortSurvivalController>(CohortSurvivalController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
