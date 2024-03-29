import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { DatasetTag } from '../entity'

@Injectable()
export class DatasetTagRepository extends Repository<DatasetTag> {
  constructor(dataSource: DataSource) {
    super(DatasetTag, dataSource.createEntityManager())
  }
  async getTags(datasetId: string) {
    return await this.createQueryBuilder('tag').where('tag.datasetId = :datasetId', { datasetId }).getMany()
  }

  async insertTag(trxMgr: EntityManager, entity: Partial<DatasetTag>) {
    const result = await trxMgr.insert(DatasetTag, entity)
    return {
      id: result.identifiers[0].id
    }
  }

  async deleteTag(trxMgr: EntityManager, criteria: any) {
    return await trxMgr.delete(DatasetTag, criteria)
  }
}
