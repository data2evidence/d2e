import { Test, TestingModule } from '@nestjs/testing'
import { DataQualityService } from './data-quality.service'
import { DataQualityOverviewParser } from './data-quality-overview.parser'
import { PrefectAPI } from '../prefect/prefect.api'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { AnalyticsSvcAPI } from '../analytics-svc/analytics-svc.api'
import { DqdService } from '../dqd/dqd.service'
import { DataflowService } from '../dataflow/dataflow.service'
import { dataQualityOverviewParserMockFactory } from './data-quality.mock'
import { prefectApiMockFactory } from '../prefect/prefect.mock'
import { portalApiMockFactory } from '../portal-server/portal-server.mock'
import { analyticsSvcApiMockFactory } from '../analytics-svc/analytics-svc.mock'
import { dqdServiceMockFactory } from '../dqd/dqd.mock'
import { dataflowServiceMockFactory } from '../dataflow/dataflow.mock'

describe('DataQualityService', () => {
  let service: DataQualityService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataQualityService,
        { provide: DataQualityOverviewParser, useFactory: dataQualityOverviewParserMockFactory },
        { provide: PrefectAPI, useFactory: prefectApiMockFactory },
        { provide: PortalServerAPI, useFactory: portalApiMockFactory },
        { provide: AnalyticsSvcAPI, useFactory: analyticsSvcApiMockFactory },
        { provide: DqdService, useFactory: dqdServiceMockFactory },
        { provide: DataflowService, useFactory: dataflowServiceMockFactory }
      ]
    }).compile()

    service = module.get<DataQualityService>(DataQualityService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
