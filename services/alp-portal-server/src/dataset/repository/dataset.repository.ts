import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { Dataset } from '../entity'

@Injectable()
export class DatasetRepository extends Repository<Dataset> {
  constructor(dataSource: DataSource) {
    super(Dataset, dataSource.createEntityManager())
  }

  async getDataset(id: string) {
    return await this.createQueryBuilder('dataset').where('dataset.id = :id', { id }).getOne()
  }

  async updateDataset(trxMgr: EntityManager, id: string, entity: Partial<Dataset>) {
    await trxMgr.update(Dataset, id, entity)
    return {
      id
    }
  }

  async insertDataset(trxMgr: EntityManager, entity: Partial<Dataset>) {
    const result = await trxMgr.insert(Dataset, entity)
    return {
      id: result.identifiers[0].id
    }
  }

  async deleteDataset(trxMgr: EntityManager, id: string) {
    await trxMgr.delete(Dataset, { id })
    return {
      id: id
    }
  }
}
