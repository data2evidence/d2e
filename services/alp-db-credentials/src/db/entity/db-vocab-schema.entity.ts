import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, Unique } from 'typeorm'
import { Database } from './db.entity'
import { Audit } from '../../common/entity'

@Entity()
@Unique(['dbId', 'name'])
export class DbVocabSchema extends Audit {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ name: 'db_id' })
  dbId: string

  @ManyToOne(() => Database, db => db, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'db_id' })
  db: Database
}
