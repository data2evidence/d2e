import { IsUUID, IsString, IsOptional } from 'class-validator'

export class DataQualityFlowRunDto {
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
  vocabSchemaName: string

  @IsString()
  @IsOptional()
  releaseId: string

  @IsString()
  @IsOptional()
  cohortDefinitionId: string
}
