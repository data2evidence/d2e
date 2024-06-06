import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { PluginUploadStatus } from '../../../common/const'
import { DefaultPlugins } from '../../../prefect-flow/entity'

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
        status: PluginUploadStatus.PENDING,
        others: {},
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: uuidv4(),
        name: 'data-characterization',
        type: 'default',
        url: 'https://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@github.com/alp-os/d2e-plugins.git@main#subdirectory=data-characterization',
        status: PluginUploadStatus.PENDING,
        others: {},
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: uuidv4(),
        name: 'data-management',
        type: 'default',
        url: 'https://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@github.com/alp-os/d2e-plugins.git@main#subdirectory=data-management',
        status: PluginUploadStatus.PENDING,
        others: {},
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: uuidv4(),
        name: 'data-quality',
        type: 'default',
        url: 'https://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@github.com/alp-os/d2e-plugins.git@main#subdirectory=data-quality',
        status: PluginUploadStatus.PENDING,
        others: {},
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: uuidv4(),
        name: 'dataflow-ui',
        type: 'default',
        url: 'https://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@github.com/alp-os/d2e-plugins.git@main#subdirectory=dataflow-ui',
        status: PluginUploadStatus.PENDING,
        others: {},
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: uuidv4(),
        name: 'duckdb',
        type: 'default',
        url: 'https://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@github.com/alp-os/d2e-plugins.git@main#subdirectory=duckdb',
        status: PluginUploadStatus.PENDING,
        others: {},
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: uuidv4(),
        name: 'i2b2',
        type: 'default',
        url: 'https://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@github.com/alp-os/d2e-plugins.git@main#subdirectory=i2b2',
        status: PluginUploadStatus.PENDING,
        others: {},
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: uuidv4(),
        name: 'meilisearch-embeddings',
        type: 'default',
        url: 'https://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@github.com/alp-os/d2e-plugins.git@main#subdirectory=meilisearch-embeddings',
        status: PluginUploadStatus.PENDING,
        others: {},
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: uuidv4(),
        name: 'meilisearch',
        type: 'default',
        url: 'https://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@github.com/alp-os/d2e-plugins.git@main#subdirectory=meilisearch',
        status: PluginUploadStatus.PENDING,
        others: {},
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: uuidv4(),
        name: 'r-cdm',
        type: 'default',
        url: 'https://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@github.com/alp-os/d2e-plugins.git@main#subdirectory=r-cdm',
        status: PluginUploadStatus.PENDING,
        others: {},
        createdBy: 'system',
        modifiedBy: 'system'
      }
    ])
    await repository.save(entities)
  }
}
