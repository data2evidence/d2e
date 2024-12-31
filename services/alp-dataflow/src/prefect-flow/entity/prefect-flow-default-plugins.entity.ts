import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { PluginUploadStatus } from '../../common/const'

@Entity('default_plugins')
export class DefaultPlugins extends Audit {
  @PrimaryColumn({ type: 'uuid' })
  pluginId: string

  @Column()
  name: string

  @Column()
  type: string

  @Column({ nullable: true })
  url: string

  @Column()
  status: PluginUploadStatus
}