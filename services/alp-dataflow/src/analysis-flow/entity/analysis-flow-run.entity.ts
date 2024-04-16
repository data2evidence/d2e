import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { Analysisflow } from './analysis-flow.entity'
import { AnalysisflowResult } from './analysis-flow-result.entity'

@Entity('analysisflow_run')
export class AnalysisflowRun extends Audit {
  @PrimaryColumn({ name: 'root_flow_run_id', type: 'uuid' })
  rootFlowRunId: string

  @Column({ name: 'analysisflow_id', type: 'uuid' })
  analysisflowId: string

  @ManyToOne(() => Analysisflow, analysisflow => analysisflow.runs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analysisflow_id' })
  analysisflow: Analysisflow

  @OneToMany(() => AnalysisflowResult, result => result.flowRun)
  results: AnalysisflowResult[]
}
