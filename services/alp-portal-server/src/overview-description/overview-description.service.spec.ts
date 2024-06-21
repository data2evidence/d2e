import { Test, TestingModule } from '@nestjs/testing'
import { REQUEST } from '@nestjs/core'
import { getRepositoryToken } from '@nestjs/typeorm'
import { repositoryMockFactory } from '../../test/repository.mock'
import { OverviewDescriptionService } from './overview-description.service'
import { OverviewDescription } from './entity'

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn().mockReturnValue({ sub: 'mock-sub' })
}))

describe('OverviewDescriptionService', () => {
  let service: OverviewDescriptionService

  beforeEach(async () => {
    const req = {
      headers: {
        authorization: 'Bearer token'
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OverviewDescriptionService,
        { provide: REQUEST, useValue: req },
        { provide: getRepositoryToken(OverviewDescription), useFactory: repositoryMockFactory }
      ]
    }).compile()

    service = await module.resolve<OverviewDescriptionService>(OverviewDescriptionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
