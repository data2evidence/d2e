import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { IPrefectTaskResult } from '../../types'
import { DataflowRun } from './dataflow-run.entity'

@Entity('dataflow_result')
export class DataflowResult extends Audit {
  @PrimaryColumn({ name: 'task_run_id', type: 'uuid' })
  taskRunId: string

  @Column({ name: 'root_flow_run_id', type: 'uuid' })
  rootFlowRunId: string

  @Column({ name: 'flow_run_id', type: 'uuid' })
  flowRunId: string

  @Column({ name: 'node_name', type: 'varchar' })
  nodeName: string

  @Column({ name: 'task_run_result', type: 'jsonb' })
  taskRunResult: IPrefectTaskResult

  @Column({ name: 'error', type: 'boolean', default: false })
  error: boolean

  @Column({ name: 'error_message', nullable: true })
  errorMessage: string

  @ManyToOne(() => DataflowRun, flowRun => flowRun.results, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'root_flow_run_id' })
  flowRun: DataflowRun
}
