import { Service } from 'typedi'
import { Repository } from 'typeorm'
import dataSource from '../../common/data-source/data-source'
import { DbExtra } from '../entity'

@Service()
export class DbExtraRepository extends Repository<DbExtra> {
  constructor() {
    super(DbExtra, dataSource.createEntityManager())
  }
}
