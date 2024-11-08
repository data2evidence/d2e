import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from 'class-validator'
import { Container } from 'typedi'
import { DbRepository } from '../../db/repository'
import { createLogger } from '../../logger'
import { DbUpdateDto } from '../../db/dto/db.dto'
import { DB_DIALECT } from '../const'

const logger = createLogger('IsValidSchemaUpdateConstraint')

@ValidatorConstraint({ async: true })
class IsValidSchemaUpdateConstraint implements ValidatorConstraintInterface {
  private readonly dbRepo: DbRepository
  constructor() {
    this.dbRepo = Container.get(DbRepository)
  }

  async validate(schema: string, validationArguments: ValidationArguments) {
    const obj = validationArguments.object as DbUpdateDto
    try {
      const db = await this.dbRepo.findOne({ where: { id: obj.id } })
      if (db) {
        if (db.dialect === DB_DIALECT.HANA) {
          return /^[A-Z_]+$/.test(schema)
        }
        return /^[a-z_)]+$/.test(schema)
      }
    } catch (err) {
      logger.error(`Error while validating db schema: ${err}`)
    }
    return false
  }

  defaultMessage() {
    return 'Invalid schema found'
  }
}

export function IsValidSchemaUpdate(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: options,
      validator: IsValidSchemaUpdateConstraint,
      async: true
    })
  }
}
