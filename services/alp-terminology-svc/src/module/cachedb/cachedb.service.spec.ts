import { Test, TestingModule } from '@nestjs/testing';
import { CachedbService } from './cachedb.service';

describe('CachedbService', () => {
  let service: CachedbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CachedbService],
    }).compile();

    service = module.get<CachedbService>(CachedbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
