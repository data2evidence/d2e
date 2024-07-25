import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { DataflowRevision } from './dataflow-revision.entity'

@Entity('dataflow')
export class Dataflow extends Audit {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column()
  name: string

  @Column({ name: 'last_flow_run_id', type: 'uuid', nullable: true })
  lastFlowRunId: string

  @OneToMany(() => DataflowRevision, revision => revision.dataflow)
  revisions: DataflowRevision[]
}
