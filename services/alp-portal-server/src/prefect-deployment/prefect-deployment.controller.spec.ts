import { Test, TestingModule } from '@nestjs/testing'
import { PrefectDeploymentController } from './prefect-deployment.controller'
import { PrefectDeploymentService } from './prefect-deployment.service'
import { prefectDeploymentServiceMockFactory } from './prefect-deployment.mock'

describe('PrefectDeploymentController', () => {
  let controller: PrefectDeploymentController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrefectDeploymentController],
      providers: [{ provide: PrefectDeploymentService, useFactory: prefectDeploymentServiceMockFactory }]
    }).compile()

    controller = module.get<PrefectDeploymentController>(PrefectDeploymentController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
