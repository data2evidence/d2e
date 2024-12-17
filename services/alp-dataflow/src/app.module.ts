import { RouterModule } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from './common/data-source/data-source'
import { DataflowModule } from './dataflow/dataflow.module'
import { AnalysisflowModule } from './analysis-flow/analysis-flow.module'
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
import { CohortSurvivalModule } from './cohort-survival/cohort-survival.module'
import { UtilsModule } from './utils/utils.module'
import { SeedService } from './common/data-source/seeds/seed.service'

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

const cohortSurvivalRoutes = {
  path: 'cohort-survival',
  module: CohortSurvivalModule
}

const dbSvcRoutes = {
  path: 'db-svc',
  module: DbSvcModule
}

const jobHistoryRoutes = {
  path: 'job-history',
  module: JobHistoryModule
}

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    DataflowModule,
    AnalysisflowModule,
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
    CohortSurvivalModule,
    UtilsModule,
    RouterModule.register([prefectRoutes, dqdRoutes, cohortRoutes, dbSvcRoutes, jobHistoryRoutes, cohortSurvivalRoutes])
  ],
  providers: [SeedService]
})
export class AppModule {}
