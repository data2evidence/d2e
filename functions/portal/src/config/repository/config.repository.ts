import { Inject, Injectable } from '@danet/core'
import { Repository } from 'npm:typeorm'
import { DATABASE } from '../../database/module.ts'
import { PostgresService } from '../../database/postgres.service.ts'
import { Config } from '../entity/index.ts'
import { IConfigUpdateDto } from '../../types.d.ts';

@Injectable()
export class ConfigRepository {
  private repository: Repository<Config> | null = null;
  constructor(@Inject(DATABASE) private dbService: PostgresService) { }

  private async getRepository() {
    if (!this.repository) {
      const dataSource = await this.dbService.getDataSourceAsync();
      this.repository = dataSource.getRepository(Config);
    }
    return this.repository;
  }

  async findOneOrFail(type: string): Promise<Config | null> {
    const repository = await this.getRepository();
    return await repository.findOneOrFail({ where: { type } })
  }

  async update(criteria: any, config: IConfigUpdateDto): Promise<void> {
    const repository = await this.getRepository();
    await repository.update(criteria, config)
    return
  }
}
