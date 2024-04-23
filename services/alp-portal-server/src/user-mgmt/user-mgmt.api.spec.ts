import { REQUEST } from '@nestjs/core'
import { HttpService } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { httpServiceMockFactory } from '../../test/http-service.mock'
import { UserMgmtApi } from './user-mgmt.api'
import { env } from '../env'

env.USER_MGMT_API_URL = 'user-mgmt-url'

describe('UserMgmtApi', () => {
  let api: UserMgmtApi

  beforeEach(async () => {
    const req = {
      headers: {
        authorization: 'Bearer token'
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMgmtApi,
        { provide: REQUEST, useValue: req },
        { provide: HttpService, useFactory: httpServiceMockFactory }
      ]
    }).compile()

    api = await module.resolve<UserMgmtApi>(UserMgmtApi)
  })

  it('should be defined', () => {
    expect(api).toBeDefined()
  })
})
