import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { IReactFlow } from '../../types'
import { Dataflow } from './dataflow.entity'

@Entity('dataflow_revision')
export class DataflowRevision extends Audit {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column({ name: 'flow', type: 'jsonb' })
  flow: IReactFlow

  @Column({ nullable: true })
  comment: string

  @Column({ name: 'dataflow_id', type: 'uuid' })
  dataflowId: string

  @ManyToOne(() => Dataflow, dataflow => dataflow.revisions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dataflow_id' })
  dataflow: Dataflow

  @Column({ name: 'version', type: 'int', nullable: false })
  version: number
}
