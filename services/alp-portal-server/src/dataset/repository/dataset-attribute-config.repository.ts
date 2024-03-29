import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { DatasetAttributeConfig } from '../entity'

@Injectable()
export class DatasetAttributeConfigRepository extends Repository<DatasetAttributeConfig> {
  constructor(dataSource: DataSource) {
    super(DatasetAttributeConfig, dataSource.createEntityManager())
  }
  async getAttributeConfigs() {
    return await this.createQueryBuilder('attribute_config').getMany()
  }

  async insertAttributeConfig(attributeConfig: DatasetAttributeConfig) {
    return await this.insert(attributeConfig)
  }

  async updateAttributeConfig(criteria: string, attributeConfig: DatasetAttributeConfig) {
    return await this.update(criteria, attributeConfig)
  }

  async deleteAttributeConfig(attributeConfig: DatasetAttributeConfig) {
    return await this.delete(attributeConfig.id)
  }
}
