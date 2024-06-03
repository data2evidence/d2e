import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { DefaultPlugins } from 'src/prefect-flow/entity'

export default class DefaultPluginsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(DefaultPlugins)

    // Only run seeder if default_plugins table is empty
    const result = await repository.createQueryBuilder('default_plugins').getMany()
    if (result.length > 0) {
      return
    }

    const entities = repository.create([
      {
        pluginId: uuidv4(),
        name: 'cohort-generator',
        type: 'default',
        url: 'https://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@github.com/alp-os/d2e-plugins.git@main#subdirectory=cohort-generator',
        status: 'uninstalled',
        others: {},
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: uuidv4(),
        name: 'data-characterization',
        type: 'default',
        url: 'https://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@github.com/alp-os/d2e-plugins.git@main#subdirectory=data-characterization',
        status: 'uninstalled',
        others: {},
        createdBy: 'system',
        modifiedBy: 'system'
      }
    ])
    await repository.save(entities)
  }
}
