import { Injectable } from '@nestjs/common'
import { IDatasetFilterParamsDto } from '../types'
import { DatasetRepository } from './repository'
import { AnalyticsApi } from '../analytics/analytics.api'

@Injectable()
export class DatasetFilterService {
  constructor(private readonly datasetRepo: DatasetRepository, private readonly analyticsApi: AnalyticsApi) {}

  async getFilterScopes() {
    const datasetsWithSchema = await this.datasetRepo
      .createQueryBuilder('dataset')
      .where('dataset.schemaName is not null')
      .getMany()

    const encodedDatasetsWithSchema = encodeURIComponent(JSON.stringify(datasetsWithSchema))

    return await this.analyticsApi.getFilterScopes(encodedDatasetsWithSchema)
  }

  async getDatabaseSchemaFilterResults(
    filterParams: IDatasetFilterParamsDto,
    datasetsWithSchema: { databaseCode: string; schemaName: string }[]
  ) {
    const encodedDatasetsWithSchema = encodeURIComponent(JSON.stringify(datasetsWithSchema))
    const encodedFilterParams = encodeURIComponent(JSON.stringify(filterParams))

    return await this.analyticsApi.getDatabaseSchemaFilter(encodedDatasetsWithSchema, encodedFilterParams)
  }
}
