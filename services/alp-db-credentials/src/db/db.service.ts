import { Service } from 'typedi'
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '../logger'
import { DbRepository, DbExtraRepository, DbCredentialRepository, DbVocabSchemaRepository } from './repository'
import { DbDialect, IDbCredentialDto, IDbCredentialUpdateDto, IDbDto, IDbExtraDto, IDbUpdateDto } from '../types'
import { getReqContext } from '../common/hook'
import { SERVICE_SCOPE } from '../common/const'

@Service()
export class DbService {
  private readonly logger = createLogger(this.constructor.name)

  constructor(
    private readonly dbRepo: DbRepository,
    private readonly dbExtraRepo: DbExtraRepository,
    private readonly credentialRepo: DbCredentialRepository,
    private readonly vocabSchemaRepo: DbVocabSchemaRepository
  ) {}

  async list() {
    const { grantType } = getReqContext()
    const isClientCredentials = grantType === 'client_credentials'
    const query = this.dbRepo
      .createQueryBuilder('db')
      .leftJoinAndSelect('db.credentials', 'dbCredential')
      .leftJoinAndSelect('db.vocabSchemas', 'dbVocabSchema')
      .leftJoinAndSelect('db.extra', 'dbExtra')
      .where('dbCredential.serviceScope = :serviceScope AND dbExtra.serviceScope = :serviceScope', {
        serviceScope: SERVICE_SCOPE.INTERNAL
      })

    const result = await query.select(this.getDbColumns(isClientCredentials)).getMany()
    return result.map(r => {
      const { extra, vocabSchemas, ...entity } = r
      return {
        ...entity,
        extra: extra && extra[0].value,
        vocabSchemas: vocabSchemas.map(vocabSchema => vocabSchema.name)
      }
    })
  }

  async get(id: string, serviceScope: string) {
    const maskedValue = '*******'
    const { grantType } = getReqContext()
    const db = await this.dbRepo
      .createQueryBuilder('db')
      .leftJoinAndSelect('db.credentials', 'dbCredential')
      .leftJoinAndSelect('db.extra', 'dbExtra')
      .where('db.id = :id AND dbCredential.serviceScope = :serviceScope AND dbExtra.serviceScope = :serviceScope', {
        id,
        serviceScope
      })
      .select(this.getDbColumns(true))
      .getOne()

    if (!db) {
      return null
    }

    if (grantType !== 'client_credentials') {
      db.credentials.forEach(c => {
        c.password = maskedValue
        delete c.salt
      })
    }

    return {
      ...db,
      extra: db.extra && db.extra.find(ext => ext.serviceScope === serviceScope).value
    }
  }

  async getVocabSchemas(dialect: DbDialect) {
    const result = await this.dbRepo
      .createQueryBuilder('db')
      .leftJoinAndSelect('db.vocabSchemas', 'vocabSchema')
      .select(['db.code', 'vocabSchema.name'])
      .where('db.dialect = :dialect', { dialect })
      .getMany()

    return result.reduce((acc, db) => {
      acc[db.code] = db.vocabSchemas.map(vocabSchema => vocabSchema.name)
      return acc
    }, {})
  }

  async create(dbDto: IDbDto) {
    const dbId = uuidv4()
    const { credentials, extra, vocabSchemas, ...newDbDto } = dbDto

    const credEntities = this.mapCredentialsToEntity(credentials, dbId)
    const entity = this.dbRepo.create({
      ...newDbDto,
      id: dbId,
      extra: this.mapExtraToEntity(extra, dbId),
      credentials: credEntities,
      vocabSchemas: this.mapVocabSchemasToEntity(vocabSchemas, dbId)
    })
    await this.dbRepo.save(this.addOwner(entity))
    this.logger.debug(`Created db: ${JSON.stringify(entity)}`)
    return entity.id
  }

  async update(dbDto: IDbUpdateDto) {
    const { id, vocabSchemas } = dbDto
    const existingDb = await this.dbRepo
      .createQueryBuilder('db')
      .leftJoinAndSelect('db.vocabSchemas', 'vocabSchema')
      .where('db.id = :id', { id })
      .getOne()

    const { vocabSchemas: existingVocabSchemaEntities } = existingDb
    if (vocabSchemas) {
      const vocabSchemaEntities = this.mapVocabSchemasToEntity(vocabSchemas, dbDto.id)
      await this.vocabSchemaRepo.upsert(vocabSchemaEntities, ['name', 'dbId'])
      existingVocabSchemaEntities
        .filter(o => vocabSchemaEntities.find(n => o.name === n.name) === undefined)
        .forEach(async existingVocabSchema => {
          await this.vocabSchemaRepo.delete({ name: existingVocabSchema.name, dbId: id })
        })
    } else {
      await this.vocabSchemaRepo.delete({ dbId: id })
    }

    this.logger.debug(`Updated db: ${JSON.stringify(dbDto)}`)
    return id
  }
  async updateCredentials(dbDto: IDbCredentialUpdateDto) {
    const { id, credentials } = dbDto
    const existingDb = await this.dbRepo
      .createQueryBuilder('db')
      .leftJoinAndSelect('db.credentials', 'dbCredential')
      .where('db.id = :id', { id })
      .getOne()

    const { credentials: existingCredEntities } = existingDb
    if (credentials) {
      const credEntities = this.mapCredentialsToEntity(credentials, dbDto.id)
      await this.credentialRepo.upsert(credEntities, ['username', 'dbId', 'userScope'])
      existingCredEntities
        .filter(o => credEntities.find(n => o.username === n.username) === undefined)
        .forEach(async existingCredential => {
          await this.credentialRepo.delete({ username: existingCredential.username, dbId: id })
        })
    } else {
      await this.credentialRepo.delete({ dbId: id })
    }

    this.logger.debug(`Updated db credentials: ${JSON.stringify(dbDto)}`)
    return id
  }

  async delete(id: string) {
    await this.dbRepo.delete({ id: id })
    this.logger.info(`Deleted db: ${id}`)
    return id
  }

  private getDbColumns(hasSecret: boolean = false) {
    const baseColumns = [
      'db.id',
      'db.code',
      'db.host',
      'db.port',
      'db.name',
      'db.dialect',
      'dbCredential.username',
      'dbCredential.userScope',
      'dbCredential.serviceScope',
      'dbVocabSchema.name',
      'dbExtra.value'
    ]
    if (hasSecret) {
      return [...baseColumns, 'dbExtra.serviceScope', 'dbCredential.password', 'dbCredential.salt']
    }
    return baseColumns
  }

  private addOwner<T>(object: T, ownerId?: string) {
    const { userId } = getReqContext()
    return {
      ...object,
      createdBy: ownerId ? ownerId : userId,
      modifiedBy: userId
    }
  }

  private mapExtraToEntity(extraDto: IDbExtraDto, dbId: string) {
    return Object.keys(extraDto).map(serviceScope => {
      const entity = this.addOwner({
        serviceScope,
        dbId,
        value: extraDto[serviceScope]
      })
      return this.dbExtraRepo.create(entity)
    })
  }

  private mapCredentialsToEntity(credentials: IDbCredentialDto[], dbId: string) {
    return credentials.map(cred => {
      const credEntity = this.credentialRepo.create({
        ...cred,
        dbId: dbId
      })
      return this.addOwner(credEntity)
    })
  }

  private mapVocabSchemasToEntity(vocabSchemas: string[], dbId: string) {
    return vocabSchemas.map(vocabSchema => {
      const entity = this.addOwner({
        dbId,
        name: vocabSchema
      })
      return this.vocabSchemaRepo.create(entity)
    })
  }
}
