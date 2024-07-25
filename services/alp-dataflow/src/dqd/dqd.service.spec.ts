import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DqdService } from './dqd.service'
import { DqdResult } from './entity'
import { repositoryMockFactory } from '../../test/repository.mock'
import { PrefectAPI } from '../prefect/prefect.api'
import { prefectApiMockFactory } from '../prefect/prefect.mock'
import { portalApiMockFactory } from '../portal-server/portal-server.mock'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { UtilsService } from '../utils/utils.service'
import { utilsSvcMockFactory } from '../utils/utils.mock'

describe('DqdService', () => {
  let service: DqdService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DqdService,
        { provide: PrefectAPI, useFactory: prefectApiMockFactory },
        { provide: getRepositoryToken(DqdResult), useFactory: repositoryMockFactory },
        { provide: PortalServerAPI, useFactory: portalApiMockFactory },
        { provide: UtilsService, useFactory: utilsSvcMockFactory }
      ]
    }).compile()

    service = module.get<DqdService>(DqdService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
