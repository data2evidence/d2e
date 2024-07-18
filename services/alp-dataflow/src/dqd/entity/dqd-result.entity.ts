import { Column, Entity, PrimaryColumn } from 'typeorm'
import { IDataCharacterizationResult, IDataQualityResult } from '../../types'
// TODO: Remove this table, read from MinIO
@Entity('dqd_result')
export class DqdResult {
  @PrimaryColumn({ name: 'flow_run_id', type: 'uuid' })
  flowRunId: string

  @Column({
    type: 'jsonb'
  })
  result: IDataQualityResult | IDataCharacterizationResult

  @Column({ name: 'error', type: 'boolean', default: false })
  error: boolean

  @Column({ name: 'error_message', nullable: true })
  errorMessage: string
}
