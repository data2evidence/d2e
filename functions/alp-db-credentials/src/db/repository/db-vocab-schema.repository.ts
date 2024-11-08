import { Service } from 'typedi'
import { Repository } from 'typeorm'
import dataSource from '../../common/data-source/data-source'
import { DbVocabSchema } from '../entity'

@Service()
export class DbVocabSchemaRepository extends Repository<DbVocabSchema> {
  constructor() {
    super(DbVocabSchema, dataSource.createEntityManager())
  }
}
