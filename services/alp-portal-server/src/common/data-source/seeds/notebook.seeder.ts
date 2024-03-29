import { Seeder } from 'typeorm-extension'
import { DataSource, Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { Notebook } from '../../../notebook/entity'
import { notebookContents } from './notebooks'

export default class DatasetNotebookSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Notebook)

    // Only run seeder if notebook table is empty
    const result = await repository.createQueryBuilder('notebook').getMany()
    if (result.length > 0) {
      return
    }

    const notebookEntities = this.createNotebooks(repository)
    await repository.save(notebookEntities)
  }

  private createNotebooks(notebookRepo: Repository<Notebook>) {
    return Object.keys(notebookContents).map(name =>
      notebookRepo.create({
        id: uuidv4(),
        name,
        notebookContent: notebookContents[name],
        userId: 'system',
        isShared: true,
        createdBy: 'system',
        modifiedBy: 'system'
      })
    )
  }
}
