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
export class IsAnalysisflowNameExistConstraint implements ValidatorConstraintInterface {
  constructor(@InjectRepository(Analysisflow) private readonly analysisflowRepo: Repository<Analysisflow>) {}

  async validate(name: string, validationArguments?: ValidationArguments) {
    const obj = validationArguments.object as AnalysisflowDto
    const isNew = obj.id == null

    if (!isNew) {
      return !(await this.analysisflowRepo.exists({ where: { name, id: Not(obj.id) } }))
    } else {
      return !(await this.analysisflowRepo.exists({ where: { name } }))
    }
  }

  defaultMessage() {
    return `Analysisflow name "$value" already exists.`
  }
}

export function IsAnalysisflowNameExist(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IsAnalysisflowNameExistConstraint,
      async: true
    })
  }
}
