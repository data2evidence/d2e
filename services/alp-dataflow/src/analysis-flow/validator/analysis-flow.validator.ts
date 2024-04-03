import { InjectRepository } from '@nestjs/typeorm'
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from 'class-validator'
import { Not, Repository } from 'typeorm'
import { Analysisflow } from '../entity'
import { AnalysisflowDto } from '../dto/analysis-flow.dto'

@ValidatorConstraint({ async: true })
export class IsDataflowNameExistConstraint implements ValidatorConstraintInterface {
  constructor(@InjectRepository(Analysisflow) private readonly dataflowRepo: Repository<Analysisflow>) {}

  async validate(name: string, validationArguments?: ValidationArguments) {
    const obj = validationArguments.object as AnalysisflowDto
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
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IsDataflowNameExistConstraint,
      async: true
    })
  }
}
