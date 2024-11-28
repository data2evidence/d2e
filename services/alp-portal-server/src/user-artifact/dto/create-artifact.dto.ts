import { IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ServiceName } from '../enums'

export class CreateArtifactDto<T> {
  @IsString()
  serviceName: ServiceName

  @ValidateNested()
  @Type(() => Object)
  serviceArtifact: T
}
