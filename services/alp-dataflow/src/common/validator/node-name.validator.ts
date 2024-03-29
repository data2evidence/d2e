import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint()
export class ValidNodeName implements ValidatorConstraintInterface {
  validate(nodeName: string, args?: ValidationArguments) {
    return /^[a-zA-Z0-9_]+$/.test(nodeName)
  }

  defaultMessage(args: ValidationArguments) {
    return `Node name is invalid: ${args.value}`
  }
}
