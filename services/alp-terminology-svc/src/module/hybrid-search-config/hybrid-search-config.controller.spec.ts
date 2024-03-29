import { Test, TestingModule } from '@nestjs/testing';
import { HybridSearchConfigController } from './hybrid-search-config.controller';
import { hybridSearchConfigServiceMockFactory } from './hybrid-search-config.mock';
import { HybridSearchConfigService } from './hybrid-search-config.service';

describe('HybridSearchConfigController', () => {
  let controller: HybridSearchConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HybridSearchConfigController],
      providers: [
        {
          provide: HybridSearchConfigService,
          useFactory: hybridSearchConfigServiceMockFactory,
        },
      ],
    }).compile();

    controller = module.get<HybridSearchConfigController>(
      HybridSearchConfigController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
