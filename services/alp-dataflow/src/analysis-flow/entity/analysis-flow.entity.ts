import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { AnalysisflowRevision } from './analysis-flow-revision.entity'
import { AnalysisflowRun } from './analysis-flow-run.entity'

@Entity('analysisflow')
export class Analysisflow extends Audit {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column()
  name: string

  @Column({ name: 'last_flow_run_id', type: 'uuid', nullable: true })
  lastFlowRunId: string

  @OneToMany(() => AnalysisflowRevision, revision => revision.dataflow)
  revisions: AnalysisflowRevision[]

  @OneToMany(() => AnalysisflowRun, dataflowRun => dataflowRun.dataflow)
  runs: AnalysisflowRun[]
}
