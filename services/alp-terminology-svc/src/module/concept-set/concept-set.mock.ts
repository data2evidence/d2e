import { ConceptSetService } from './concept-set.service';
import { MockType } from 'test/type.mock';

export const conceptSetServiceMockFactory: () => MockType<ConceptSetService> =
  jest.fn(() => ({
    getConceptSet: jest.fn(),
  }));
