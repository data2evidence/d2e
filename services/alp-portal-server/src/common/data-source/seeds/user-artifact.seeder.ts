import { Seeder } from 'typeorm-extension'
import { DataSource, Repository } from 'typeorm'
import { notebookContents } from './notebooks'
import { UserArtifact } from '../../../user-artifact/entity'
import { Notebook } from '../../../notebook/entity'

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
        notebooks: notebookEntities
      },
      createdBy: 'system',
      modifiedBy: 'system'
    })

    await repository.save(entities)
  }
}
