import { Module } from '@nestjs/common'
import { UserArtifactService } from './user-artifact.service'
import { UserArtifactController } from './user-artifact.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserArtifact } from './entity/user-artifact.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserArtifact])],
  providers: [UserArtifactService],
  controllers: [UserArtifactController],
  exports: [UserArtifactService]
})
export class UserArtifactModule {}
