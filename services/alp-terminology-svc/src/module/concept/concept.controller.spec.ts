import { Test, TestingModule } from '@nestjs/testing';
import { ConceptController } from './concept.controller';
import { ConceptService } from './concept.service';

describe('ConceptController', () => {
  let appController: ConceptController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConceptController],
      providers: [ConceptService],
    }).compile();

    appController = app.get<ConceptController>(ConceptController);
  });
  const conceptListDto = {
    tenantId: '703c5d8a-a1d9-4d42-a314-5b9aad513391',
    datasetId: '703c5d8a-a1d9-4d42-a314-5b9aad513390',
    offset: 0,
    count: 10,
    code: 'nausea',
  };

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(
        appController.getConcepts(
          conceptListDto.code,
          conceptListDto.offset,
          conceptListDto.count,
          conceptListDto.datasetId,
          conceptListDto.tenantId,
        ),
      ).toBeDefined();
    });
  });

  describe('Get concept connections', () => {
    it('should return concept connections', () => {
      expect(
        appController.getConcepts(
          conceptListDto.code,
          conceptListDto.offset,
          conceptListDto.count,
          conceptListDto.datasetId,
          conceptListDto.tenantId,
        ),
      ).toBeDefined();
    });
  });
});
