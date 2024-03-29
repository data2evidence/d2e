import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { Dataset } from './dataset.entity'

@Entity('dataset_release')
export class DatasetRelease extends Audit {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'name' })
  name: string

  @Column({ name: 'release_date', type: 'timestamp' })
  releaseDate: Date

  // Required for creation
  @Column({ name: 'dataset_id' })
  datasetId: string

  @ManyToOne(() => Dataset, dataset => dataset, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'dataset_id' })
  dataset: Dataset
}
