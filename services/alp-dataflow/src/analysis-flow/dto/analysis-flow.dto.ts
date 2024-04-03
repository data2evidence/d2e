import { IsArray, IsNotEmpty, IsNotEmptyObject, IsOptional, IsUUID, Validate, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { IDataflowDto, IDataflowDuplicateDto, IDataflowRevisionDto } from '../../types'
import { EdgeDto, NodeDto } from '../../common/dto'
import { IsDataflowNameExist, UniqueNodeName } from '../validator'

class AnalysisflowRevisionDto implements IDataflowRevisionDto {
  @IsArray()
  @Validate(UniqueNodeName)
  @ValidateNested()
  @Type(() => NodeDto)
  nodes: NodeDto[]

  @IsArray()
  @ValidateNested()
  @Type(() => EdgeDto)
  edges: EdgeDto[]

  @IsOptional()
  comment: string
}

export class AnalysisflowDto implements IDataflowDto {
  @IsUUID()
  @IsOptional()
  id: string

  @IsNotEmpty()
  @IsDataflowNameExist()
  name: string

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AnalysisflowRevisionDto)
  dataflow: AnalysisflowRevisionDto
}

export class DataflowDuplicateDto implements IDataflowDuplicateDto {
  @IsNotEmpty()
  name: string
}
