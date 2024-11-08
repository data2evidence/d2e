import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from 'class-validator'
import { Container } from 'typedi'
import { DbRepository } from '../../db/repository'
import { createLogger } from '../../logger'

const logger = createLogger('IsExistingDbConstraint')

@ValidatorConstraint({ async: true })
class IsExistingDbConstraint implements ValidatorConstraintInterface {
  private readonly dbRepo: DbRepository
  constructor() {
    this.dbRepo = Container.get(DbRepository)
  }

  async validate(id: string) {
    try {
      return await this.dbRepo.exists({ where: { id } })
    } catch (err) {
      logger.info(`Error while validating db id: ${err}`)
      return false
    }
  }

  defaultMessage() {
    return `Database id '$value' does not exist`
  }
}

export function IsExistingDb(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: options,
      validator: IsExistingDbConstraint,
      async: true
    })
  }
}
