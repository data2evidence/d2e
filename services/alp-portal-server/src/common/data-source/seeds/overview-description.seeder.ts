import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { OverviewDescription } from '../../../overview-description/entity'

export default class OverviewDescriptionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(OverviewDescription)

    const result = await repository.createQueryBuilder('overview_description').getMany()
    if (result.length > 0) {
      return
    }

    const entities = repository.create({
      id: '1',
      text: 'Our vision is a world where health data is comprehensively, digitally, and securely available for research and directly impacts the prevention, diagnosis, and treatment of diseases.',
      createdBy: 'system',
      modifiedBy: 'system'
    })
    await repository.save(entities)
  }
}