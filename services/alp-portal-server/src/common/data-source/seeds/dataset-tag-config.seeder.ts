import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'

import { DatasetTagConfig } from '../../../dataset/entity'

export default class DatasetTagConfigSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(DatasetTagConfig)

    // Only run seeder if dataset_tag_config table is empty
    const result = await repository.createQueryBuilder('tag_config').getMany()
    if (result.length > 0) {
      return
    }

    const entities = repository.create([
      {
        name: 'COVID',
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        name: 'Diabetes',
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        name: 'Study',
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        name: 'CRONOS',
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        name: 'eCOV',
        createdBy: 'system',
        modifiedBy: 'system'
      }
    ])
    await repository.save(entities)
  }
}
