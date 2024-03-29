import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'

@Entity('feature')
@Unique(['feature'])
export class Feature extends Audit {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  feature: string

  @Column({ name: 'is_enabled' })
  isEnabled: boolean
}
