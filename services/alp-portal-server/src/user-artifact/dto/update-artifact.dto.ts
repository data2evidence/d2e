import { IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateArtifactDto<T> {
  @IsString()
  userId: string

  @IsString()
  id: string

  @ValidateNested()
  @Type(() => Object)
  serviceArtifact: T
}
