import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { DatasetTagConfig } from '../entity'

@Injectable()
export class DatasetTagConfigRepository extends Repository<DatasetTagConfig> {
  constructor(dataSource: DataSource) {
    super(DatasetTagConfig, dataSource.createEntityManager())
  }
  async getTagConfigs() {
    return await this.createQueryBuilder('tag_config').getMany()
  }

  async insertTagConfig(tagConfig: DatasetTagConfig) {
    return await this.insert(tagConfig)
  }

  async deleteTagConfig(tagConfig: DatasetTagConfig) {
    return await this.delete(tagConfig.name)
  }
}
