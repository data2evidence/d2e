import { REQUEST } from '@nestjs/core'
import { HttpService } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { httpServiceMockFactory } from '../../test/http-service.mock'
import { SharedPortalApi } from './shared-portal.api'
import { env } from '../env'

env.TREX_API_URL = 'portal-url'

describe('SharedPortalApi', () => {
  let api: SharedPortalApi

  beforeEach(async () => {
    const req = {
      headers: {
        authorization: 'Bearer token'
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharedPortalApi,
        { provide: REQUEST, useValue: req },
        { provide: HttpService, useFactory: httpServiceMockFactory }
      ]
    }).compile()

    api = await module.resolve<SharedPortalApi>(SharedPortalApi)
  })

  it('should be defined', () => {
    expect(api).toBeDefined()
  })
})
