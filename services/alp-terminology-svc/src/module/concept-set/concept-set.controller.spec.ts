import { Test, TestingModule } from '@nestjs/testing';
import { ConceptSetController } from './concept-set.controller';
import { conceptSetServiceMockFactory } from './concept-set.mock';
import { ConceptSetService } from './concept-set.service';

describe('ConceptSetController', () => {
  let controller: ConceptSetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConceptSetController],
      providers: [
        {
          provide: ConceptSetService,
          useFactory: conceptSetServiceMockFactory,
        },
      ],
    }).compile();

    controller = module.get<ConceptSetController>(ConceptSetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
