import { IsString } from 'class-validator'

export class MeilisearchAddIndexFlowRunDto {
  @IsString()
  databaseCode: string

  @IsString()
  vocabSchemaName: string

  @IsString()
  tableName: string
}
