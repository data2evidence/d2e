import { Test, TestingModule } from '@nestjs/testing'
import { PrefectController } from './prefect.controller'
import { prefectServiceMockFactory } from './prefect.mock'
import { PrefectService } from './prefect.service'

describe('PrefectController', () => {
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
