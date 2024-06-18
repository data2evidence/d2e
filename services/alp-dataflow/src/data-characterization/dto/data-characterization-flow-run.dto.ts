import { IsUUID, IsString, IsOptional } from 'class-validator'

export class DataCharacterizationFlowRunDto {
  @IsUUID()
  datasetId: string

  @IsString()
  deploymentName: string

  @IsString()
  flowName: string

  @IsString()
  @IsOptional()
  comment: string

  @IsString()
  @IsOptional()
  releaseId: string

  @IsString()
  @IsOptional()
  excludeAnalysisIds: string
}
