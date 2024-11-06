import { Test, TestingModule } from '@nestjs/testing'
import { UserArtifactController } from './user-artifact.controller'

describe('UserArtifactController', () => {
  let controller: UserArtifactController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserArtifactController]
    }).compile()

    controller = module.get<UserArtifactController>(UserArtifactController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
