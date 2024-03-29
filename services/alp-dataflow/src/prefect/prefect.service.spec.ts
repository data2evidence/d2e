import { Test, TestingModule } from '@nestjs/testing'
import { PrefectService } from './prefect.service'
import { PrefectAPI } from './prefect.api'
import {
  prefectApiMockFactory,
  prefectExecutionClientMockFactory,
  prefectParamsTransformerMockFactory
} from './prefect.mock'
import { DataflowService } from '../dataflow/dataflow.service'
import { dataflowServiceMockFactory } from '../dataflow/dataflow.mock'
import { PrefectParamsTransformer } from './prefect-params.transformer'
import { PrefectExecutionClient } from './prefect-execution.client'
import { PrefectFlowService } from '../prefect-flow/prefect-flow.service'
import { prefectFlowServiceMockFactory } from '../prefect-flow/prefect-flow.mock'
import { dataQualityServiceMockFactory } from '../data-quality/data-quality.mock'
import { DataQualityService } from '../data-quality/data-quality.service'

describe('PrefectService', () => {
  let service: PrefectService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrefectService,
        { provide: DataflowService, useFactory: dataflowServiceMockFactory },
        { provide: PrefectAPI, useFactory: prefectApiMockFactory },
        { provide: PrefectParamsTransformer, useFactory: prefectParamsTransformerMockFactory },
        { provide: PrefectExecutionClient, useFactory: prefectExecutionClientMockFactory },
        { provide: PrefectFlowService, useFactory: prefectFlowServiceMockFactory },
        { provide: DataQualityService, useFactory: dataQualityServiceMockFactory }
      ]
    }).compile()

    service = module.get<PrefectService>(PrefectService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
