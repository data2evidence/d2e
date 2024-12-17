import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { notebookContents } from './notebooks'
import { UserArtifact } from '../../../user-artifact/entity'

export default class UserArtifactSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(UserArtifact)

    const result = await repository.createQueryBuilder('userArtifact').getMany()
    if (result.length > 0) {
      return
    }

    const notebookEntities = Object.keys(notebookContents).map(name => ({
      id: notebookContents[name].id,
      name,
      notebookContent: notebookContents[name].content,
      userId: 'system',
      isShared: true,
      createdBy: 'system',
      modifiedBy: 'system'
    }))

    const entities = repository.create({
      userId: 'system',
      artifacts: {
        notebooks: notebookEntities,
        dataflow: [],
        dataflow_revision: [],
        dataflow_run: [],
        analysis_flow: [],
        analysis_flow_run: [],
        pa_config: [],
        cdw_config: [],
        bookmarks: [],
        concept_sets: []
      },
      createdBy: 'system',
      modifiedBy: 'system'
    })

    await repository.save(entities)
  }
}
