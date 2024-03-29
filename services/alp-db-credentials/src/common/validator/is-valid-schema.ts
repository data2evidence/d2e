import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from 'class-validator'
import { DbDto } from '../../db/dto/db.dto'
import { DB_DIALECT } from '../const'

@ValidatorConstraint()
class IsValidSchemaConstraint implements ValidatorConstraintInterface {
  async validate(schema: string, validationArguments: ValidationArguments) {
    const obj = validationArguments.object as DbDto
    if (obj.dialect === DB_DIALECT.HANA) {
      return /^[A-Z_]+$/.test(schema)
    }
    return /^[a-z_)]+$/.test(schema)
  }

  defaultMessage() {
    return 'Invalid schema found'
  }
}

export function IsValidSchema(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: options,
      validator: IsValidSchemaConstraint
    })
  }
}
