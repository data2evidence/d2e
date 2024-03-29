import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { Dataset } from './dataset.entity'

@Entity('dataset_dashboard')
export class DatasetDashboard extends Audit {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column()
  name: string

  @Column()
  url: string

  @Column({ name: 'base_path' })
  basePath: string

  // Required for creation
  @Column({ name: 'dataset_id' })
  datasetId: string

  @ManyToOne(() => Dataset, dataset => dataset.dashboards, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'dataset_id' })
  dataset: Dataset
}
