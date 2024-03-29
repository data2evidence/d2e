import { Service } from 'typedi'
import { Repository } from 'typeorm'
import dataSource from '../../common/data-source/data-source'
import { Database } from '../entity'

@Service()
export class DbRepository extends Repository<Database> {
  constructor() {
    super(Database, dataSource.createEntityManager())
  }
}
