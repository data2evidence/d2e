import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateArtifactDto<T> {
  @ValidateNested()
  @Type(() => Object)
  serviceArtifact: T
}
