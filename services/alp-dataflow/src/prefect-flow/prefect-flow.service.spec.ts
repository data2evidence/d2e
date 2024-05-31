import { Test, TestingModule } from '@nestjs/testing'
import { PrefectFlowService } from './prefect-flow.service'
import { PrefectAPI } from '../prefect/prefect.api'
import { prefectApiMockFactory } from '../prefect/prefect.mock'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { portalApiMockFactory } from '../portal-server/portal-server.mock'
import { REQUEST } from '@nestjs/core'
import { getRepositoryToken } from '@nestjs/typeorm'
import { FlowMetadata } from './entity'
import { repositoryMockFactory } from '../../test/repository.mock'

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn().mockReturnValue({ sub: 'mock-sub' })
}))

describe('PrefectFlowService', () => {
  let service: PrefectFlowService

  beforeEach(async () => {
    const req = {
      headers: {
        authorization: 'Bearer token'
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrefectFlowService,
        { provide: PrefectAPI, useFactory: prefectApiMockFactory },
        { provide: PortalServerAPI, useFactory: portalApiMockFactory },
        { provide: REQUEST, useValue: req },
        { provide: getRepositoryToken(FlowMetadata), useFactory: repositoryMockFactory }
      ]
    }).compile()

    service = module.get<PrefectFlowService>(PrefectFlowService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
