import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { DatasetAttribute } from '../entity'
import { IDatasetAttribute, IDatasetAttributeDto } from '../../types'

@Injectable()
export class DatasetAttributeRepository extends Repository<DatasetAttribute> {
  constructor(dataSource: DataSource) {
    super(DatasetAttribute, dataSource.createEntityManager())
  }

  async getAttributeDto(datasetId: string, trxMgr: EntityManager | undefined = undefined) {
    const entities = await this.createQueryBuilder('attribute', trxMgr?.queryRunner)
      .where('attribute.datasetId = :datasetId', { datasetId })
      .getMany()

    return entities.reduce<IDatasetAttributeDto[]>((acc, entity) => {
      acc.push({
        attributeId: entity.attributeId,
        studyId: entity.datasetId,
        value: entity.value
      })
      return acc
    }, [])
  }

  async getDatasetAttribute(datasetId: string, attributeId: string) {
    return await this.createQueryBuilder('attribute')
      .where('attribute.datasetId = :datasetId', { datasetId })
      .andWhere('attribute.attributeId = :attributeId', { attributeId })
      .getOne()
  }

  async insertAttribute(trxMgr: EntityManager, entity: Partial<DatasetAttribute>) {
    const result = await trxMgr.insert(DatasetAttribute, entity)
    return {
      id: result.identifiers[0].id
    }
  }

  async deleteAttribute(trxMgr: EntityManager, criteria: Partial<DatasetAttribute>) {
    return await trxMgr.delete(DatasetAttribute, criteria)
  }

  createAttribute(datasetId, attribute: IDatasetAttribute) {
    const entity: Partial<DatasetAttribute> = { datasetId, attributeId: attribute.attributeId, value: attribute.value }
    return entity
  }
}
