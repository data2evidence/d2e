import { IsNotEmpty, IsString } from 'class-validator'

export class PrefectFlowRunResultDto {
  @IsString()
  @IsNotEmpty()
  filePath: string
}
