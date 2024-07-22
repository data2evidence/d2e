import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class PrefectFlowRunResultDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  filePath?: string

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  filePaths?: string[]
}
