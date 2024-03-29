import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { DatasetRelease } from '../entity'

@Injectable()
export class DatasetReleaseRepository extends Repository<DatasetRelease> {
  constructor(private _dataSource: DataSource) {
    super(DatasetRelease, _dataSource.createEntityManager())
  }

  async insertRelease(trxMgr: EntityManager, entity: Partial<DatasetRelease>) {
    const result = await trxMgr.insert(DatasetRelease, entity)
    return {
      id: result.identifiers[0].id
    }
  }

  async getReleaseByDatasetIdAndName(datasetId: string, releaseName: string) {
    return await this.createQueryBuilder('release')
      .where('release.dataset_id = :datasetId and release.name = :name', { datasetId: datasetId, name: releaseName })
      .getMany()
  }
}
