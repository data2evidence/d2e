import { IsUUID, IsString, IsOptional } from 'class-validator'

export class DataCharacterizationFlowRunDto {
  @IsUUID()
  datasetId: string

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
  excludeAnalysisIds: string
}
