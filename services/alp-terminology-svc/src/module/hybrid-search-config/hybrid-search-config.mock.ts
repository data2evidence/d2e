import { HybridSearchConfigService } from './hybrid-search-config.service';
import { MockType } from 'test/type.mock';

export const hybridSearchConfigServiceMockFactory: () => MockType<HybridSearchConfigService> =
  jest.fn(() => ({
    getHybridSearchConfig: jest.fn(),
  }));
