import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { DbCredential } from './db-credential.entity'
import { DbExtra } from './db-extra.entity'
import { DbVocabSchema } from './db-vocab-schema.entity'
import { Audit } from '../../common/entity'

@Entity({ name: 'db' })
export class Database extends Audit {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column()
  host: string

  @Column()
  port: number

  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column()
  dialect: string

  @OneToMany(() => DbExtra, dbExtra => dbExtra.db, { nullable: true, cascade: ['insert'] })
  extra: DbExtra[]

  @OneToMany(() => DbCredential, dbCredential => dbCredential.db, { cascade: ['insert'] })
  credentials: DbCredential[]

  @OneToMany(() => DbVocabSchema, dbVocabSchema => dbVocabSchema.db, { nullable: true, cascade: ['insert'] })
  vocabSchemas: DbVocabSchema[]
}
