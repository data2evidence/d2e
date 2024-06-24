import { IsString, IsNumber, ValidateNested } from 'class-validator'

export class CohortSurvivalFlowRunOptions {
  @IsString()
  databaseCode: string

  @IsString()
  schemaName: string

  @IsString()
  datasetId: string

  @IsNumber()
  targetCohortDefinitionId: number

  @IsNumber()
  outcomeCohortDefinitionId: number
}
export class CohortSurvivalFlowRunDto {
  @ValidateNested()
  options: CohortSurvivalFlowRunOptions
}
