import { IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { IOverviewDescriptionUpdateDto } from '../../types'

export class OverviewDescriptionUpdateDto implements IOverviewDescriptionUpdateDto {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @IsString()
  text: string
}
