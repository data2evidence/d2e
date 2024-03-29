import { IsString, IsNotEmpty, IsUUID, Validate } from 'class-validator'
import { IDatasetAttributeDto } from '../../types'
import { IsDatasetAttributeValueValid } from '../validator/dataset-attribute.validator'

export class DatasetAttributeDto implements IDatasetAttributeDto {
  @IsNotEmpty()
  @IsUUID()
  studyId: string

  @IsString()
  attributeId: string

  @IsString()
  @Validate(IsDatasetAttributeValueValid)
  value: string
}
