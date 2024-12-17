import { Column, Entity, PrimaryColumn } from 'npm:typeorm'
import { ATTRIBUTE_CONFIG_CATEGORIES, ATTRIBUTE_CONFIG_DATA_TYPES } from '../../common/const.ts'
import { Audit } from '../../common/entity/audit.entity.ts'

@Entity('dataset_attribute_config')
export class DatasetAttributeConfig extends Audit {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column({
    type: 'enum',
    enum: ATTRIBUTE_CONFIG_DATA_TYPES,
    default: ATTRIBUTE_CONFIG_DATA_TYPES.STRING
  })
  dataType: ATTRIBUTE_CONFIG_DATA_TYPES

  @Column({
    type: 'enum',
    enum: ATTRIBUTE_CONFIG_CATEGORIES,
    default: ATTRIBUTE_CONFIG_CATEGORIES.DATASET
  })
  category: ATTRIBUTE_CONFIG_CATEGORIES

  @Column({ name: 'is_displayed' })
  isDisplayed: boolean
}
