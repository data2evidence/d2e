import { Test, TestingModule } from '@nestjs/testing'
import { REQUEST } from '@nestjs/core'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DataflowService } from './dataflow.service'
import { Dataflow, DataflowRevision, DataflowResult, DataflowRun } from './entity'
import { repositoryMockFactory } from '../../test/repository.mock'
import { portalApiMockFactory } from '../portal-server/portal-server.mock'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { PrefectAPI } from '../prefect/prefect.api'
import { prefectApiMockFactory } from '../prefect/prefect.mock'
import { UtilsService } from '../utils/utils.service'
import { utilsSvcMockFactory } from '../utils/utils.mock'

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn().mockReturnValue({ sub: 'mock-sub' })
}))

describe('DataflowService', () => {
  let service: DataflowService

  beforeEach(async () => {
    const req = {
      headers: {
        authorization: 'Bearer token'
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataflowService,
        { provide: REQUEST, useValue: req },
        { provide: getRepositoryToken(Dataflow), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(DataflowRevision), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(DataflowRun), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(DataflowResult), useFactory: repositoryMockFactory },
        { provide: PortalServerAPI, useFactory: portalApiMockFactory },
        { provide: PrefectAPI, useFactory: prefectApiMockFactory },
        { provide: UtilsService, useFactory: utilsSvcMockFactory }
      ]
    }).compile()

    service = await module.resolve<DataflowService>(DataflowService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
