import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { NodeDto } from '../../common/dto'

@ValidatorConstraint()
export class UniqueNodeName implements ValidatorConstraintInterface {
  private nodeNames: string[]
  validate(nodes: NodeDto[], args?: ValidationArguments) {
    const nodeNames = nodes.map(n => n.data.name)
    this.nodeNames = nodeNames
    return new Set(nodeNames).size === nodeNames.length
  }

  defaultMessage() {
    return `Node names should be unique and must not have duplicates: ${JSON.stringify(this.nodeNames)}`
  }
}
