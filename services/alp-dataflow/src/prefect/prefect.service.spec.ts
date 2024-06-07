import { Test, TestingModule } from '@nestjs/testing'
import { PrefectService } from './prefect.service'
import { PrefectAPI } from './prefect.api'
import {
  prefectApiMockFactory,
  prefectExecutionClientMockFactory,
  prefectParamsTransformerMockFactory,
  prefectAnalysisParamsTransformerMockFactory
} from './prefect.mock'
import { DataflowService } from '../dataflow/dataflow.service'
import { dataflowServiceMockFactory } from '../dataflow/dataflow.mock'
import { PrefectParamsTransformer } from './prefect-params.transformer'
import { PrefectExecutionClient } from './prefect-execution.client'
import { PrefectFlowService } from '../prefect-flow/prefect-flow.service'
import { prefectFlowServiceMockFactory } from '../prefect-flow/prefect-flow.mock'
import { dataQualityServiceMockFactory } from '../data-quality/data-quality.mock'
import { DataQualityService } from '../data-quality/data-quality.service'
import { dataCharacterizationServiceMockFactory } from '../data-characterization/data-characterization.mock'
import { DataCharacterizationService } from '../data-characterization/data-characterization.service'
import { AnalysisflowService } from '../analysis-flow/analysis-flow.service'
import { analysisflowServiceMockFactory } from '../analysis-flow/analysis-flow.mock'
import { PrefectAnalysisParamsTransformer } from './prefect-analysis-params.transformer'

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
        { provide: DataQualityService, useFactory: dataQualityServiceMockFactory },
        { provide: DataCharacterizationService, useFactory: dataCharacterizationServiceMockFactory },
        { provide: AnalysisflowService, useFactory: analysisflowServiceMockFactory },
        { provide: PrefectAnalysisParamsTransformer, useFactory: prefectAnalysisParamsTransformerMockFactory }
      ]
    }).compile()

    service = module.get<PrefectService>(PrefectService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
