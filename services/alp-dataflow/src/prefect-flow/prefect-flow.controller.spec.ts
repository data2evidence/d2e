import { Test, TestingModule } from '@nestjs/testing'
import { PrefectFlowController } from './prefect-flow.controller'
import { PrefectFlowService } from './prefect-flow.service'
import { prefectFlowServiceMockFactory } from './prefect-flow.mock'

describe('PrefectFlowController', () => {
  let controller: PrefectFlowController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrefectFlowController],
      providers: [{ provide: PrefectFlowService, useFactory: prefectFlowServiceMockFactory }]
    }).compile()

    controller = module.get<PrefectFlowController>(PrefectFlowController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
