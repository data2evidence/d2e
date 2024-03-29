import { Test, TestingModule } from '@nestjs/testing'
import { REQUEST } from '@nestjs/core'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DataflowService } from './dataflow.service'
import { Dataflow, DataflowRevision, DataflowResult, DataflowRun } from './entity'
import { repositoryMockFactory } from '../../test/repository.mock'

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
        { provide: getRepositoryToken(DataflowResult), useFactory: repositoryMockFactory }
      ]
    }).compile()

    service = await module.resolve<DataflowService>(DataflowService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
