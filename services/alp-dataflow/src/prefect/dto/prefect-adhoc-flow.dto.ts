import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { IPrefectAdhocFlowDto } from '../../types'

export class PrefectAdhocFlowDto implements IPrefectAdhocFlowDto {
  @IsOptional()
  @IsString()
  url: string

  @IsBoolean()
  fromDefaultPlugin: boolean

  @IsString()
  defaultPluginId: string
}
