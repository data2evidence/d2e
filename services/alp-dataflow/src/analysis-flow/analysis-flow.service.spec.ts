import { Test, TestingModule } from '@nestjs/testing'
import { REQUEST } from '@nestjs/core'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AnalysisflowService } from './analysis-flow.service'
import { Analysisflow, AnalysisflowRevision, AnalysisflowResult, AnalysisflowRun } from './entity'
import { repositoryMockFactory } from '../../test/repository.mock'

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn().mockReturnValue({ sub: 'mock-sub' })
}))

describe('AnalysisflowService', () => {
  let service: AnalysisflowService

  beforeEach(async () => {
    const req = {
      headers: {
        authorization: 'Bearer token'
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisflowService,
        { provide: REQUEST, useValue: req },
        { provide: getRepositoryToken(Analysisflow), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(AnalysisflowRevision), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(AnalysisflowRun), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(AnalysisflowResult), useFactory: repositoryMockFactory }
      ]
    }).compile()

    service = await module.resolve<AnalysisflowService>(AnalysisflowService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
