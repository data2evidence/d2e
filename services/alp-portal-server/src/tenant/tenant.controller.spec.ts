import { Test, TestingModule } from '@nestjs/testing'
import { TenantController } from './tenant.controller'
import { TenantService } from './tenant.service'
import { tenantServiceMockFactory } from './tenant.mock'

describe('TenantController', () => {
  let controller: TenantController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [{ provide: TenantService, useFactory: tenantServiceMockFactory }]
    }).compile()

    controller = module.get<TenantController>(TenantController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
