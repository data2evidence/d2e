import { IsNotEmpty, IsNotEmptyObject, IsUUID, Validate, ValidateNested } from 'class-validator'
import { IFlowBasicNodeData, IReactFlowEdge, IReactFlowNode } from '../../types'
import { ValidNodeName } from '../validator'
import { Type } from 'class-transformer'

class NodeDataDto implements IFlowBasicNodeData {
  @IsNotEmpty({ message: 'Node name should not be empty' })
  @Validate(ValidNodeName)
  name: string
  description: string
}

export class NodeDto implements IReactFlowNode {
  @IsUUID()
  id: string
  @IsNotEmpty()
  type: string
  @ValidateNested()
  @Type(() => NodeDataDto)
  @IsNotEmptyObject()
  data: NodeDataDto
  position: { x: number; y: number }
  sourcePosition: string
  targetPosition: string
  dragHandle: string
  width: number
  height: number
  parentNode: string
}

export class EdgeDto implements IReactFlowEdge {
  @IsNotEmpty()
  id: string
  @IsNotEmpty()
  source: string
  @IsNotEmpty()
  target: string
}
