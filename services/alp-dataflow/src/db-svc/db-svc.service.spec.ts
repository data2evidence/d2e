import { REQUEST } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { DBSvcService } from './db-svc.service'
import { PrefectAPI } from '../prefect/prefect.api'
import { prefectApiMockFactory } from '../prefect/prefect.mock'

describe('DBSvcService', () => {
  let service: DBSvcService

  beforeEach(async () => {
    const req = {
      headers: {
        authorization: 'Bearer token'
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DBSvcService,
        { provide: REQUEST, useValue: req },
        { provide: PrefectAPI, useFactory: prefectApiMockFactory }
      ]
    }).compile()

    service = await module.resolve<DBSvcService>(DBSvcService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
