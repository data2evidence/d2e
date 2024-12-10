import { Module } from '@nestjs/common';
import { ConceptModule } from './module/concept/concept.module';
import { ConceptSetModule } from './module/concept-set/concept-set.module';
import { RouterModule, Routes } from '@nestjs/core';
import { env } from './env';
import { SeedService } from './db/seeds/seed.service';
import { FhirModule } from './module/concept/fhir.module';
import { HealthModule } from './health-check/health.module';
import { CachedbModule } from './module/cachedb/cachedb.module';

const routes: Routes = [
  {
    path: `${env.TERMINOLOGY_SVC__PATH || 'terminology'}`,
    children: [
      {
        path: 'concept',
        module: ConceptModule,
      },
      {
        path: 'fhir',
        module: FhirModule,
      },
      {
        path: 'concept-set',
        module: ConceptSetModule,
      },
    ],
  },
];

@Module({
  imports: [
    ConceptModule,
    FhirModule,
    ConceptSetModule,
    HealthModule,
    RouterModule.register(routes),
    CachedbModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
