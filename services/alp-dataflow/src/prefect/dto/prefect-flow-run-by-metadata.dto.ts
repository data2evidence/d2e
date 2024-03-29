import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator'
import { IPrefectFlowRunByMetadataDto } from '../../types'

export class PrefectFlowRunByMetadataDto implements IPrefectFlowRunByMetadataDto {
  @IsNotEmpty()
  @IsString()
  type: string

  @IsOptional()
  @IsString()
  flowRunName: string

  @IsOptional()
  @IsString()
  flowId: string

  @IsOptional()
  @IsObject()
  options: object
}
