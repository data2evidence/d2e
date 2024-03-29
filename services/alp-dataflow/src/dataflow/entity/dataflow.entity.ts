import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { DataflowRevision } from './dataflow-revision.entity'
import { DataflowRun } from './dataflow-run.entity'

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

  @OneToMany(() => DataflowRun, dataflowRun => dataflowRun.dataflow)
  runs: DataflowRun[]
}
