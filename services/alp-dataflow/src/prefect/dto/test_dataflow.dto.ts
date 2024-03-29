import { IsArray, IsNotEmptyObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { IReactFlow, ITestDataflowDto } from '../../types'
import { NodeDto, EdgeDto } from '../../common/dto'

class ReactFlowDto implements IReactFlow {
  @IsArray()
  @ValidateNested()
  @Type(() => NodeDto)
  nodes: NodeDto[]

  @IsArray()
  @ValidateNested()
  @Type(() => EdgeDto)
  edges: EdgeDto[]
}

export class TestDataflowDto implements ITestDataflowDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ReactFlowDto)
  dataflow: ReactFlowDto
}
