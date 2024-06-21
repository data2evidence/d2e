import { Test, TestingModule } from '@nestjs/testing'
import { OverviewDescriptionController } from './overview-description.controller'
import { OverviewDescriptionService } from './overview-description.service'
import { overviewDescriptionMockFactory } from './overview-description.mock'

describe('OverviewDescriptionController', () => {
  let controller: OverviewDescriptionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OverviewDescriptionController],
      providers: [{ provide: OverviewDescriptionService, useFactory: overviewDescriptionMockFactory }]
    }).compile()

    controller = module.get<OverviewDescriptionController>(OverviewDescriptionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
