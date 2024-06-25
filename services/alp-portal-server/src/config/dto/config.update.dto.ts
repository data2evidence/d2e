import { IsNotEmpty, IsString } from 'class-validator'
import { IConfigUpdateDto } from '../../types'

export class ConfigUpdateDto implements IConfigUpdateDto {
  @IsNotEmpty()
  type: string

  @IsString()
  value: string
}
