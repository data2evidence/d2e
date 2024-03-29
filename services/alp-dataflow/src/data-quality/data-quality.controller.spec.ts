import { Test, TestingModule } from '@nestjs/testing'
import { DataQualityController } from './data-quality.controller'
import { DataQualityService } from './data-quality.service'
import { dataQualityServiceMockFactory } from './data-quality.mock'

describe('DataQualityController', () => {
  let controller: DataQualityController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataQualityController],
      providers: [{ provide: DataQualityService, useFactory: dataQualityServiceMockFactory }]
    }).compile()

    controller = module.get<DataQualityController>(DataQualityController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
