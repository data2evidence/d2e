import { Test, TestingModule } from '@nestjs/testing'
import { AnalysisflowController } from './analysis-flow.controller'
import { analysisflowServiceMockFactory } from './analysis-flow.mock'
import { AnalysisflowService } from './analysis-flow.service'

describe('AnalysisflowController', () => {
  let controller: AnalysisflowController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisflowController],
      providers: [{ provide: AnalysisflowService, useFactory: analysisflowServiceMockFactory }]
    }).compile()

    controller = module.get<AnalysisflowController>(AnalysisflowController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
