import { Test, TestingModule } from '@nestjs/testing'
import { SystemService } from './system.service'

describe('SystemService', () => {
  let service: SystemService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemService,
        { provide: 'PLUGINS_JSON_PROVIDER', useValue: '{}' } // useValue could also be a mock object (with PLUGINS_JSON)
      ]
    }).compile()

    service = module.get<SystemService>(SystemService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
