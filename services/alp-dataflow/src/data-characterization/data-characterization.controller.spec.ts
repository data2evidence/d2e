import { Test, TestingModule } from '@nestjs/testing'
import { DataCharacterizationController } from './data-characterization.controller'
import { DataCharacterizationService } from './data-characterization.service'
import { dataCharacterizationServiceMockFactory } from './data-characterization.mock'

describe('DataCharacterizationController', () => {
  let controller: DataCharacterizationController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataCharacterizationController],
      providers: [{ provide: DataCharacterizationService, useFactory: dataCharacterizationServiceMockFactory }]
    }).compile()

    controller = module.get<DataCharacterizationController>(DataCharacterizationController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
