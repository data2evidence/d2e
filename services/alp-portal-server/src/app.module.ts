import { DynamicModule, Module, Type } from '@nestjs/common'
import { RouteTree, RouterModule } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatasetModule } from './dataset/dataset.module'
import { ResourceModule } from './dataset/resource/resource.module'
import { PublicDatasetModule } from './dataset/public/public-dataset.module'
import { DatasetPaConfigModule } from './dataset/pa-config/dataset-pa-config.module'
import { TenantModule } from './tenant/tenant.module'
import { HealthModule } from './health-check/health.module'
import { PaConfigModule } from './pa-config/pa-config.module'
import { dataSourceOptions } from './common/data-source/data-source'
import { SystemModule } from './system/system.module'
import { NotebookModule } from './notebook/notebook.module'
import { MetadataConfigModule } from './dataset/metadata-config/metadata-config.module'
import { FeatureModule } from './feature/feature.module'
import { PrefectDeploymentModule } from './prefect-deployment/prefect-deployment.module'
import { SeedService } from './common/data-source/seeds/seed.service'

const tenantRoutes: RouteTree = {
  path: 'tenant',
  module: TenantModule
}

const featureRoutes: RouteTree = {
  path: 'feature',
  module: FeatureModule
}

const notebookRoutes: RouteTree = {
  path: 'notebook',
  module: NotebookModule
}

const prefectDeploymentRoutes: RouteTree = {
  path: 'prefect-deployment',
  module: PrefectDeploymentModule
}

const imports: Array<DynamicModule | Type<any>> = [
  TypeOrmModule.forRoot(dataSourceOptions),
  DatasetModule,
  ResourceModule,
  PublicDatasetModule,
  TenantModule,
  FeatureModule,
  HealthModule,
  SystemModule,
  PaConfigModule,
  DatasetPaConfigModule,
  MetadataConfigModule,
  NotebookModule,
  PrefectDeploymentModule,
  RouterModule.register([
    tenantRoutes,
    featureRoutes,
    notebookRoutes,
    prefectDeploymentRoutes,
    {
      path: 'dataset',
      module: DatasetModule,
      children: [
        {
          path: ':datasetId/resource',
          module: ResourceModule
        },
        {
          path: ':datasetId/pa-config',
          module: DatasetPaConfigModule
        },
        {
          path: 'metadata-config',
          module: MetadataConfigModule
        },
        {
          path: 'public',
          module: PublicDatasetModule
        }
      ]
    }
  ])
]

@Module({
  imports,
  providers: [SeedService]
})
export class AppModule {}
