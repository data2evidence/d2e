import { IsArray, IsNotEmpty, IsNotEmptyObject, IsOptional, IsUUID, Validate, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { IDataflowDto, IDataflowDuplicateDto, IDataflowRevisionDto } from '../../types'
import { EdgeDto, NodeDto } from '../../common/dto'
import { IsDataflowNameExist, UniqueNodeName } from '../validator'

class DataflowRevisionDto implements IDataflowRevisionDto {
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

export class DataflowDto implements IDataflowDto {
  @IsUUID()
  @IsOptional()
  id: string

  @IsNotEmpty()
  @IsDataflowNameExist()
  name: string

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DataflowRevisionDto)
  dataflow: DataflowRevisionDto
}

export class DataflowDuplicateDto implements IDataflowDuplicateDto {
  @IsNotEmpty()
  name: string
}
