import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'

@Entity('flow_metadata')
export class FlowMetadata extends Audit {
  @PrimaryColumn({ type: 'uuid' })
  flowId: string

  @Column()
  name: string

  @Column()
  type: string

  @Column()
  entrypoint: string

  @Column({ type: 'simple-array', nullable: true })
  datamodels: string[]

  @Column({ nullable: true })
  url: string

  @Column({ type: 'simple-json', nullable: true })
  others: any
}
