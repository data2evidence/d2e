import { Test, TestingModule } from '@nestjs/testing';
import { UserArtifactService } from './user-artifact.service';

describe('UserArtifactService', () => {
  let service: UserArtifactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserArtifactService],
    }).compile();

    service = module.get<UserArtifactService>(UserArtifactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
