import { Test, TestingModule } from '@nestjs/testing'
import { DataflowController } from './analysis-flow.controller'
import { dataflowServiceMockFactory } from './analysis-flow.mock'
import { DataflowService } from './analysis-flow.service'

describe('AnalysisflowController', () => {
  let controller: DataflowController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataflowController],
      providers: [{ provide: DataflowService, useFactory: dataflowServiceMockFactory }]
    }).compile()

    controller = module.get<DataflowController>(DataflowController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
