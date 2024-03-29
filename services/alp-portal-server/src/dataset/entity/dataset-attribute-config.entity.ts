import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Audit } from '../../common/entity/audit.entity'
import { ATTRIBUTE_CONFIG_CATEGORIES, ATTRIBUTE_CONFIG_DATA_TYPES } from '../../common/const'

@Entity('dataset_attribute_config')
export class DatasetAttributeConfig extends Audit {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column({ name: 'data_type' })
  dataType: ATTRIBUTE_CONFIG_DATA_TYPES

  @Column({ name: 'category' })
  category: ATTRIBUTE_CONFIG_CATEGORIES

  @Column({ name: 'is_displayed' })
  isDisplayed: boolean
}
