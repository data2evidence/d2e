import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { DatasetDashboard } from '../entity'

@Injectable()
export class DatasetDashboardRepository extends Repository<DatasetDashboard> {
  constructor(dataSource: DataSource) {
    super(DatasetDashboard, dataSource.createEntityManager())
  }

  async insertDashboard(trxMgr: EntityManager, entity: Partial<DatasetDashboard>) {
    const result = await trxMgr.insert(DatasetDashboard, entity)
    return {
      id: result.identifiers[0].id
    }
  }

  async deleteDashboard(trxMgr: EntityManager, criteria: { name: string; url: string; basePath: string }) {
    return await trxMgr.delete(DatasetDashboard, criteria)
  }
}
