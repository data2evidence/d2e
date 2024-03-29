import { IsArray, IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { IFeatureDto, IFeatureUpdateDto } from '../../types'

export class FeatureUpdateDto implements IFeatureUpdateDto {
  @IsArray()
  @ValidateNested()
  @Type(() => FeatureDto)
  features: FeatureDto[]
}

class FeatureDto implements IFeatureDto {
  @IsNotEmpty()
  feature: string

  @IsBoolean()
  isEnabled: boolean
}
