import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { IPrefectFlowDto } from '../../types'

export class PrefectFlowDto implements IPrefectFlowDto {
  @IsUUID()
  @IsOptional()
  id?: string

  @IsNotEmpty()
  name: string
}
