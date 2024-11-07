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
import { PrefectModule } from './prefect/prefect.module'
import { ConfigModule } from './config/config.module'
import { SeedService } from './common/data-source/seeds/seed.service'
import { UserArtifactModule } from './user-artifact/user-artifact.module'
import { GroupModule } from './user-artifact/group/group.module'

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

const prefectRoutes: RouteTree = {
  path: 'prefect',
  module: PrefectModule
}

const overviewDescriptionRoutes: RouteTree = {
  path: 'config',
  module: ConfigModule
}

const userArtifactRoutes: RouteTree = {
  path: 'user-artifact',
  module: UserArtifactModule,
  children: [
    {
      path: '/group',
      module: GroupModule
    }
  ]
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
  PrefectModule,
  ConfigModule,
  UserArtifactModule,
  RouterModule.register([
    tenantRoutes,
    featureRoutes,
    notebookRoutes,
    prefectRoutes,
    overviewDescriptionRoutes,
    userArtifactRoutes,
    {
      path: 'dataset',
      module: DatasetModule,
      children: [
        {
          path: '/resource',
          module: ResourceModule
        },
        {
          path: '/pa-config',
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
