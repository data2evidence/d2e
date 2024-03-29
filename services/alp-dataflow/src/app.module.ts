import { RouterModule } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from './common/data-source/data-source'
import { DataflowModule } from './dataflow/dataflow.module'
import { HealthModule } from './health-check/health.module'
import { PrefectModule } from './prefect/prefect.module'
import { DataQualityModule } from './data-quality/data-quality.module'
import { DqdModule } from './dqd/dqd.module'
import { DataCharacterizationModule } from './data-characterization/data-characterization.module'
import { PortalServerModule } from './portal-server/portal-server.module'
import { DbSvcModule } from './db-svc/db-svc.module'
import { AnalyticsSvcModule } from './analytics-svc/analytics-svc.module'
import { PrefectFlowModule } from './prefect-flow/prefect-flow.module'
import { CohortModule } from './cohort/cohort.module'
import { JobHistoryModule } from './job-history/job-history.module'
import { MeilisearchModule } from './meilisearch/meilisearch.module'

const dqdRoutes = {
  path: 'dqd',
  module: DqdModule,
  children: [
    {
      path: 'data-quality',
      module: DataQualityModule
    },
    {
      path: 'data-characterization',
      module: DataCharacterizationModule
    }
  ]
}

const prefectRoutes = {
  path: 'prefect',
  module: PrefectModule,
  children: [
    {
      path: 'flow',
      module: PrefectFlowModule
    }
  ]
}

const cohortRoutes = {
  path: 'cohort',
  module: CohortModule
}

const dbSvcRoutes = {
  path: 'db-svc',
  module: DbSvcModule
}

const jobHistoryRoutes = {
  path: 'job-history',
  module: JobHistoryModule
}
const meilisearchRoutes = {
  path: 'meilisearch',
  module: MeilisearchModule
}

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    DataflowModule,
    HealthModule,
    PrefectModule,
    CohortModule,
    DqdModule,
    DataQualityModule,
    DataCharacterizationModule,
    PortalServerModule,
    DbSvcModule,
    AnalyticsSvcModule,
    PrefectFlowModule,
    JobHistoryModule,
    MeilisearchModule,
    RouterModule.register([prefectRoutes, dqdRoutes, cohortRoutes, dbSvcRoutes, jobHistoryRoutes, meilisearchRoutes])
  ]
})
export class AppModule {}
