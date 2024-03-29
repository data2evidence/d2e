import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, Unique } from 'typeorm'
import { Database } from './db.entity'
import { Audit } from '../../common/entity'

@Entity()
@Unique(['serviceScope', 'dbId'])
export class DbExtra extends Audit {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'jsonb' })
  value: object

  @Column({ name: 'service_scope' })
  serviceScope: string

  @Column({ name: 'db_id' })
  dbId: string

  @ManyToOne(() => Database, db => db, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'db_id' })
  db: Database
}
