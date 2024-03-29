import { Test, TestingModule } from '@nestjs/testing'
import { DataCharacterizationService } from './data-characterization.service'
import { PrefectAPI } from '../prefect/prefect.api'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { AnalyticsSvcAPI } from '../analytics-svc/analytics-svc.api'
import { prefectApiMockFactory } from '../prefect/prefect.mock'
import { portalApiMockFactory } from '../portal-server/portal-server.mock'
import { analyticsSvcApiMockFactory } from '../analytics-svc/analytics-svc.mock'

describe('DataCharacterizationService', () => {
  let service: DataCharacterizationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataCharacterizationService,
        { provide: PrefectAPI, useFactory: prefectApiMockFactory },
        { provide: PortalServerAPI, useFactory: portalApiMockFactory },
        { provide: AnalyticsSvcAPI, useFactory: analyticsSvcApiMockFactory }
      ]
    }).compile()

    service = await module.resolve<DataCharacterizationService>(DataCharacterizationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
