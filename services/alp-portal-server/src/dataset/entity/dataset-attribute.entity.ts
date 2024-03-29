import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { Dataset } from './dataset.entity'
import { DatasetAttributeConfig } from './dataset-attribute-config.entity'

@Entity('dataset_attribute')
@Unique('datasetId_attributeId', ['datasetId', 'attributeId'])
export class DatasetAttribute extends Audit {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  value: string

  // Required for creation
  @Column({ name: 'attribute_id' })
  attributeId: string
  @ManyToOne(() => DatasetAttributeConfig, attributeConfig => attributeConfig, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'attribute_id' })
  attributeConfig: DatasetAttributeConfig

  // Required for creation
  @Column({ name: 'dataset_id' })
  datasetId: string

  @ManyToOne(() => Dataset, dataset => dataset, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'dataset_id' })
  dataset: Dataset
}
