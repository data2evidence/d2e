import { Module } from '@nestjs/common'
import { GroupService } from './group.service'
import { GroupController } from './group.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserArtifactGroup } from '../entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserArtifactGroup])],
  providers: [GroupService],
  controllers: [GroupController],
  exports: [GroupService]
})
export class GroupModule {}
