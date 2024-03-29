import { Service } from 'typedi'
import { Repository } from 'typeorm'
import dataSource from '../../common/data-source/data-source'
import { DbCredential } from '../entity'

@Service()
export class DbCredentialRepository extends Repository<DbCredential> {
  constructor() {
    super(DbCredential, dataSource.createEntityManager())
  }
}
