import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DqdService } from './dqd.service'
import { DqdResult } from './entity'
import { repositoryMockFactory } from '../../test/repository.mock'
import { PrefectAPI } from '../prefect/prefect.api'
import { prefectApiMockFactory } from '../prefect/prefect.mock'

describe('DqdService', () => {
  let service: DqdService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DqdService,
        { provide: PrefectAPI, useFactory: prefectApiMockFactory },
        { provide: getRepositoryToken(DqdResult), useFactory: repositoryMockFactory }
      ]
    }).compile()

    service = module.get<DqdService>(DqdService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
