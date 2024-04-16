import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { IReactFlow } from '../../types'
import { Analysisflow } from './analysis-flow.entity'

@Entity('analysisflow_revision')
export class AnalysisflowRevision extends Audit {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column({ name: 'flow', type: 'jsonb' })
  flow: IReactFlow

  @Column({ nullable: true })
  comment: string

  @Column({ name: 'analysisflow_id', type: 'uuid' })
  analysisflowId: string

  @ManyToOne(() => Analysisflow, analysisflow => analysisflow.revisions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysisflow_id' })
  analysisflow: Analysisflow

  @Column({ name: 'version', type: 'int', nullable: false })
  version: number
}
