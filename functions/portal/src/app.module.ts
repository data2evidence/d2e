import { Module } from '@danet/core';
import { RequestContextMiddleware } from './common/request-context.middleware.ts';
import { ConfigModule } from './config/config.module.ts';
import { DatabaseModule } from './database/module.ts';
import { DatasetModule } from './dataset/dataset.module.ts';
import { FeatureModule } from './feature/feature.module.ts';
import { MinioModule } from './minio/minio.module.ts';
import { NotebookModule } from './notebook/notebook.module.ts';
import { PaConfigModule } from './pa-config/pa-config.module.ts';
import { PrefectModule } from './prefect/prefect.module.ts';
import { SystemModule } from './system/system.module.ts';
import { TenantModule } from './tenant/tenant.module.ts';
import { GroupModule } from './user-artifact/group/group.module.ts';
import { UserArtifactModule } from './user-artifact/user-artifact.module.ts';
import { UserMgmtModule } from './user-mgmt/user-mgmt.module.ts';
@Module({
  controllers: [],
  imports: [TenantModule, SystemModule, FeatureModule, ConfigModule, DatabaseModule, MinioModule, PrefectModule, UserMgmtModule, UserArtifactModule, GroupModule, DatasetModule, NotebookModule, PaConfigModule],
  injectables: [RequestContextMiddleware]
})
export class AppModule { }
