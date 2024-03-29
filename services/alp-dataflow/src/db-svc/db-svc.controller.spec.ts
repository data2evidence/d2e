import { Test, TestingModule } from '@nestjs/testing'
import { DBSvcController } from './db-svc.controller'
import { dbSvcServiceMockFactory } from './db-svc.mock'
import { DBSvcService } from './db-svc.service'

describe('DBSvcController', () => {
  let controller: DBSvcController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DBSvcController],
      providers: [{ provide: DBSvcService, useFactory: dbSvcServiceMockFactory }]
    }).compile()

    controller = module.get<DBSvcController>(DBSvcController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
