import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'

@Entity('overview_description')
export class OverviewDescription extends Audit {
  @PrimaryColumn()
  id: string

  @Column()
  text: string
}
