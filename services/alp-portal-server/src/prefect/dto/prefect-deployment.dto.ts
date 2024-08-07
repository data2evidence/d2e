import { IsNotEmpty, IsString } from 'class-validator'

export class PrefectDeploymentDeletionDto {
  @IsString()
  @IsNotEmpty()
  filePath: string

  @IsString()
  @IsNotEmpty()
  bucketName: string
}
