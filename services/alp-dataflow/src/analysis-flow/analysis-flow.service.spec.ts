import { Test, TestingModule } from '@nestjs/testing'
import { REQUEST } from '@nestjs/core'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DataflowService } from './analysis-flow.service'
import { Analysisflow, AnalysisflowRevision, AnalysisflowResult, AnalysisflowRun } from './entity'
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
        { provide: getRepositoryToken(Analysisflow), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(AnalysisflowRevision), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(AnalysisflowRun), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(AnalysisflowResult), useFactory: repositoryMockFactory }
      ]
    }).compile()

    service = await module.resolve<DataflowService>(DataflowService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
