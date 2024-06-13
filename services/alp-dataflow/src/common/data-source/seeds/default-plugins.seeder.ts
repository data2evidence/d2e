import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'
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
        pluginId: '26dd3e26-863a-4bb1-9948-faf9291275e4',
        name: 'cohort-generator',
        type: 'default',
        url: 'https://github.com/alp-os/d2e-plugins.git@main#subdirectory=cohort-generator',
        status: PluginUploadStatus.PENDING,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: '21c55927-0bc3-40e1-951d-d0b1bd01e591',
        name: 'data-characterization',
        type: 'default',
        url: 'https://github.com/alp-os/d2e-plugins.git@main#subdirectory=data-characterization',
        status: PluginUploadStatus.PENDING,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: '7bafa544-47be-4bd4-ba5e-390344fc442e',
        name: 'data-management',
        type: 'default',
        url: 'https://github.com/alp-os/d2e-plugins.git@main#subdirectory=data-management',
        status: PluginUploadStatus.PENDING,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: 'e3082810-c218-458b-9924-4f9d08b8bff1',
        name: 'data-quality',
        type: 'default',
        url: 'https://github.com/alp-os/d2e-plugins.git@main#subdirectory=data-quality',
        status: PluginUploadStatus.PENDING,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: '600a1433-09a1-4457-9720-a66b69971a85',
        name: 'dataflow-ui',
        type: 'default',
        url: 'https://github.com/alp-os/d2e-plugins.git@main#subdirectory=dataflow-ui',
        status: PluginUploadStatus.PENDING,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: 'c86f5f84-3f1d-479e-a076-55ca6ad4b43c',
        name: 'duckdb',
        type: 'default',
        url: 'https://github.com/alp-os/d2e-plugins.git@main#subdirectory=duckdb',
        status: PluginUploadStatus.PENDING,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: '17dd0be4-b69b-4f0e-9a35-bdb67a3d63e9',
        name: 'i2b2',
        type: 'default',
        url: 'https://github.com/alp-os/d2e-plugins.git@main#subdirectory=i2b2',
        status: PluginUploadStatus.PENDING,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: '55530682-d09d-4a0f-9acc-0ea6e7d0bed6',
        name: 'meilisearch-embeddings',
        type: 'default',
        url: 'https://github.com/alp-os/d2e-plugins.git@main#subdirectory=meilisearch-embeddings',
        status: PluginUploadStatus.PENDING,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: '6d027d9b-087c-4a3b-a4a9-45262dec152e',
        name: 'meilisearch',
        type: 'default',
        url: 'https://github.com/alp-os/d2e-plugins.git@main#subdirectory=meilisearch',
        status: PluginUploadStatus.PENDING,
        createdBy: 'system',
        modifiedBy: 'system'
      },
      {
        pluginId: 'a0550deb-8b6a-4000-b3e0-8b5d08dc86ad',
        name: 'r-cdm',
        type: 'default',
        url: 'https://github.com/alp-os/d2e-plugins.git@main#subdirectory=r-cdm',
        status: PluginUploadStatus.PENDING,
        createdBy: 'system',
        modifiedBy: 'system'
      }
    ])
    await repository.save(entities)
  }
}
