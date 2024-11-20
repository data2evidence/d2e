import { Entity, Column, PrimaryColumn } from 'typeorm'
import { ServiceName } from '../enums'
import { Audit } from '../../common/entity/audit.entity'

@Entity()
export class UserArtifact extends Audit {
  @PrimaryColumn({ name: 'user_id' })
  userId: string

  @Column('jsonb')
  artifacts: Record<ServiceName, any[]>
}
