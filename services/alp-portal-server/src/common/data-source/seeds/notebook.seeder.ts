import { Seeder } from 'typeorm-extension'
import { DataSource, Repository } from 'typeorm'
import { Notebook } from '../../../notebook/entity'
import { notebookContents } from './notebooks'

export default class DatasetNotebookSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Notebook)

    const notebookEntities = this.createNotebooks(repository)
    await repository.save(notebookEntities)
  }

  private createNotebooks(notebookRepo: Repository<Notebook>) {
    return Object.keys(notebookContents).map(name =>
      notebookRepo.create({
        id: notebookContents[name].id,
        name,
        notebookContent: notebookContents[name].content,
        userId: 'system',
        isShared: true,
        createdBy: 'system',
        modifiedBy: 'system'
      })
    )
  }
}
