import { IsString, IsOptional, IsObject } from 'class-validator'

export class DBSvcFlowRunDto {
  @IsString()
  dbSvcOperation: string

  @IsString()
  requestType: string

  @IsString()
  requestUrl: string

  @IsObject()
  @IsOptional()
  requestBody: object
}
