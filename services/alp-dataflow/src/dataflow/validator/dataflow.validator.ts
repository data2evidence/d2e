import { InjectRepository } from '@nestjs/typeorm'
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from 'class-validator'
import { Not, Repository } from 'typeorm'
import { Dataflow } from '../entity'
import { DataflowDto } from '../dto/dataflow.dto'

@ValidatorConstraint({ async: true })
export class IsDataflowNameExistConstraint implements ValidatorConstraintInterface {
  constructor(@InjectRepository(Dataflow) private readonly dataflowRepo: Repository<Dataflow>) {}

  async validate(name: string, validationArguments?: ValidationArguments) {
    const obj = validationArguments.object as DataflowDto
    const isNew = obj.id == null

    if (!isNew) {
      return !(await this.dataflowRepo.exists({ where: { name, id: Not(obj.id) } }))
    } else {
      return !(await this.dataflowRepo.exists({ where: { name } }))
    }
  }

  defaultMessage() {
    return `Dataflow name "$value" already exists.`
  }
}

export function IsDataflowNameExist(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IsDataflowNameExistConstraint,
      async: true
    })
  }
}
