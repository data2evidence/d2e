import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { Dataset } from './dataset.entity'

@Entity('dataset_detail')
export class DatasetDetail extends Audit {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  summary: string

  @Column({ name: 'show_request_access', default: false })
  showRequestAccess: boolean

  // Required for creation
  @Column({ name: 'dataset_id' })
  datasetId: string

  @OneToOne(() => Dataset, dataset => dataset.datasetDetail, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'dataset_id' })
  dataset: Dataset
}
