import { REQUEST } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { CohortService } from './cohort.service'
import { PrefectAPI } from '../prefect/prefect.api'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { AnalyticsSvcAPI } from '../analytics-svc/analytics-svc.api'
import { prefectApiMockFactory } from '../prefect/prefect.mock'
import { portalApiMockFactory } from '../portal-server/portal-server.mock'
import { analyticsSvcApiMockFactory } from '../analytics-svc/analytics-svc.mock'

describe('CohortService', () => {
  let service: CohortService

  beforeEach(async () => {
    const req = {
      headers: {
        authorization: 'Bearer token'
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CohortService,
        { provide: REQUEST, useValue: req },
        { provide: PrefectAPI, useFactory: prefectApiMockFactory },
        { provide: PortalServerAPI, useFactory: portalApiMockFactory },
        { provide: AnalyticsSvcAPI, useFactory: analyticsSvcApiMockFactory }
      ]
    }).compile()

    service = await module.resolve<CohortService>(CohortService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
