import { Service } from 'typedi'
import { DbDialect } from '../types'
import { env } from '../env'

@Service()
export class VocabService {
  async getVocabSchemas(dialect: DbDialect) {
    if (!Object.keys(env.VOCAB_SCHEMAS).includes(dialect)) {
      return []
    }

    return env.VOCAB_SCHEMAS[dialect]
  }
}
