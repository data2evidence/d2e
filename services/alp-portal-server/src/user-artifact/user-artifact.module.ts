import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { UserArtifactService } from './user-artifact.service'
import { UserArtifactController } from './user-artifact.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserArtifact } from './entity/user-artifact.entity'
import { PermissionsMiddleware } from './middlewares'

@Module({
  imports: [TypeOrmModule.forFeature([UserArtifact])],
  providers: [UserArtifactService],
  controllers: [UserArtifactController],
  exports: [UserArtifactService]
})
export class UserArtifactModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PermissionsMiddleware).forRoutes(UserArtifactController)
  }
}
