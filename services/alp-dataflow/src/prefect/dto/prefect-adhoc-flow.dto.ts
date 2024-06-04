import { IsOptional, IsString } from 'class-validator'
import { IPrefectAdhocFlowDto } from '../../types'

export class PrefectAdhocFlowDto implements IPrefectAdhocFlowDto {
  @IsOptional()
  @IsString()
  url: string

  @IsOptional()
  @IsString()
  defaultPluginId: string
}
