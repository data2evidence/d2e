import { IsString, IsNumber, IsBoolean, IsArray, IsObject, ValidateNested } from 'class-validator'

class CohortJson {
  @IsNumber()
  id: number

  @IsString()
  name: string

  @IsNumber()
  createdDate: number

  @IsNumber()
  modifiedDate: number

  @IsBoolean()
  hasWriteAccess: boolean

  @IsArray()
  tags: string[]

  @IsObject()
  expressionType: object
}
export class CohortGeneratorFlowRunOptions {
  @IsString()
  databaseCode: string

  @IsString()
  schemaName: string

  @IsString()
  stringvocabSchemaName: string

  @ValidateNested()
  cohortJson: CohortJson

  @IsString()
  datasetId: string

  @IsString()
  description: string

  @IsString()
  owner: string

  @IsString()
  token: string
}
export class CohortGeneratorFlowRunDto {
  @ValidateNested()
  options: CohortGeneratorFlowRunOptions
}
