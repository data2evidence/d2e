import { Test, TestingModule } from '@nestjs/testing'
import { DataflowController } from './dataflow.controller'
import { dataflowServiceMockFactory } from './dataflow.mock'
import { DataflowService } from './dataflow.service'

describe('DataflowController', () => {
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
