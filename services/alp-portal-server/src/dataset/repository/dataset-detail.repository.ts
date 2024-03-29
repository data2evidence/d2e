import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { DatasetDetail } from '../entity'

@Injectable()
export class DatasetDetailRepository extends Repository<DatasetDetail> {
  constructor(dataSource: DataSource) {
    super(DatasetDetail, dataSource.createEntityManager())
  }
  async getDetail(datasetId: string) {
    return await this.createQueryBuilder('detail').where('detail.datasetId = :datasetId', { datasetId }).getOne()
  }

  async insertDetail(trxMgr: EntityManager, entity: Partial<DatasetDetail>) {
    const result = await trxMgr.insert(DatasetDetail, entity)
    return {
      id: result.identifiers[0].id
    }
  }
}
