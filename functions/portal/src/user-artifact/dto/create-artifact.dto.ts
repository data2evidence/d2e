import { Type } from 'npm:class-transformer'
import { IsString, ValidateNested } from 'npm:class-validator'
import { ServiceName } from '../enums/index.ts'

export class CreateArtifactDto<T> {
  @IsString()
  serviceName: ServiceName

  @ValidateNested()
  @Type(() => Object)
  serviceArtifact: T
}
