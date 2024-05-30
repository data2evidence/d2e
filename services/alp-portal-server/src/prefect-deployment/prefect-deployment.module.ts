import { DynamicModule, Module, Type } from '@nestjs/common'
import { MinioModule } from '../minio/minio.module'
import { PrefectDeploymentController } from './prefect-deployment.controller'
import { PrefectDeploymentService } from './prefect-deployment.service'

const imports: Array<Type<any> | DynamicModule> = [MinioModule]
@Module({
  imports,
  controllers: [PrefectDeploymentController],
  providers: [PrefectDeploymentService]
})
export class PrefectDeploymentModule {}
