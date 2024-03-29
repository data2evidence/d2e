import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { Feature } from '../entity'

@Injectable()
export class FeatureRepository extends Repository<Feature> {
  constructor(dataSource: DataSource) {
    super(Feature, dataSource.createEntityManager())
  }

  async getFeatures() {
    return await this.createQueryBuilder('feature').getMany()
  }

  async updateFeature(trxMgr: EntityManager, id: number, entity: Partial<Feature>) {
    await trxMgr.update(Feature, id, entity)
    return {
      id
    }
  }

  async insertFeature(trxMgr: EntityManager, entity: Partial<Feature>) {
    const result = await trxMgr.insert(Feature, entity)
    return {
      id: result.identifiers[0].id
    }
  }

  async getFeature(feature: string) {
    return await this.createQueryBuilder('feature').where('feature.feature = :feature', { feature }).getOne()
  }
}
