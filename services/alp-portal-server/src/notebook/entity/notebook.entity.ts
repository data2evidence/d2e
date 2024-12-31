import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'

@Entity('notebook')
export class Notebook extends Audit {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column()
  name: string

  @Column({ name: 'notebook_content', nullable: true })
  notebookContent: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'is_shared' })
  isShared: boolean
}