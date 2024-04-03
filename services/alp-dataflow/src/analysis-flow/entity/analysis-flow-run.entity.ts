import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { Analysisflow } from './analysis-flow.entity'
import { AnalysisflowResult } from './analysis-flow-result.entity'

@Entity('analysisflow_run')
export class AnalysisflowRun extends Audit {
  @PrimaryColumn({ name: 'root_flow_run_id', type: 'uuid' })
  rootFlowRunId: string

  @Column({ name: 'dataflow_id', type: 'uuid' })
  dataflowId: string

  @ManyToOne(() => Analysisflow, dataflow => dataflow.runs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dataflow_id' })
  dataflow: Analysisflow

  @OneToMany(() => AnalysisflowResult, result => result.flowRun)
  results: AnalysisflowResult[]
}
