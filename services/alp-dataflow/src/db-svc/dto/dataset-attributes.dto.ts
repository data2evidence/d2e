import { IsString, IsObject, IsArray } from 'class-validator'

export class DatasetAttributesFlowRunDto {
  @IsString()
  token: string

  @IsObject()
  versionInfo: object

  @IsArray()
  datasetSchemaMapping: []
}
