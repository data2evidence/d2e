import { Test, TestingModule } from '@nestjs/testing'
import { PrefectController } from './prefect.controller'
import { PrefectService } from './prefect.service'
import { prefectServiceMockFactory } from './prefect.mock'

describe('PrefectDeploymentController', () => {
  let controller: PrefectController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrefectController],
      providers: [{ provide: PrefectService, useFactory: prefectServiceMockFactory }]
    }).compile()

    controller = module.get<PrefectController>(PrefectController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
