import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { Dataflow } from './dataflow.entity'
import { DataflowResult } from './dataflow-result.entity'

// TODO: Add flow_run_id column to allow insertion from dataflow-gen during flow execution
@Entity('dataflow_run')
export class DataflowRun extends Audit {
  @PrimaryColumn({ name: 'root_flow_run_id', type: 'uuid' })
  rootFlowRunId: string

  @Column({ name: 'dataflow_id', type: 'uuid' })
  dataflowId: string

  @ManyToOne(() => Dataflow, dataflow => dataflow.runs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dataflow_id' })
  dataflow: Dataflow

  @OneToMany(() => DataflowResult, result => result.flowRun)
  results: DataflowResult[]
}
