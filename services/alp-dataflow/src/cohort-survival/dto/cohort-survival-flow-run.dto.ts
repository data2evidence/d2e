import { IsString, IsNumber, IsBoolean, IsArray, IsObject, ValidateNested } from 'class-validator'

export class CohortSurvivalFlowRunOptions {
  @IsString()
  databaseCode: string

  @IsString()
  schemaName: string

  @IsNumber()
  targetCohortDefinitionId: number

  @IsNumber()
  outcomeCohortDefinitionId: number
}
export class CohortSurvivalGeneratorFlowRunDto {
  @ValidateNested()
  options: CohortSurvivalFlowRunOptions
}
