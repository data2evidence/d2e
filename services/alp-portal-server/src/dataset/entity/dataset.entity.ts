import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { DatasetAttribute, DatasetDashboard, DatasetDetail, DatasetTag } from '../entity'
import { DatabaseDialect } from '../../types'

@Entity('dataset')
export class Dataset extends Audit {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string

  @Column({ name: 'visibility_status', default: 'HIDDEN' })
  visibilityStatus: string

  @Column({ name: 'dialect' })
  dialect: DatabaseDialect

  @Column({ name: 'database_code' })
  databaseCode: string

  @Column({ name: 'schema_name', nullable: true })
  schemaName: string

  @Column({ name: 'vocab_schema_name', nullable: true })
  vocabSchemaName: string

  @Column({ name: 'token_dataset_code', unique: true })
  tokenDatasetCode: string

  @Column({ nullable: true })
  type: string

  @Column({ name: 'data_model', nullable: true })
  dataModel: string

  @Column({ name: 'plugin', nullable: true })
  plugin: string

  @Column({ name: 'source_dataset_id', type: 'uuid', nullable: true })
  sourceDatasetId: string

  @Column({ name: 'pa_config_id', type: 'uuid', nullable: true })
  paConfigId: string

  @Column({ name: 'fhir_project_id', type: 'uuid', nullable: true })
  fhir_project_id: string

  @OneToOne(() => DatasetDetail, datasetDetail => datasetDetail.dataset)
  datasetDetail: DatasetDetail

  @OneToMany(() => DatasetAttribute, DatasetAttribute => DatasetAttribute.dataset)
  attributes: DatasetAttribute[]

  @OneToMany(() => DatasetTag, datasetTag => datasetTag.dataset)
  tags: DatasetTag[]

  @OneToMany(() => DatasetDashboard, datasetDashboard => datasetDashboard.dataset)
  dashboards: DatasetDashboard[]
}
