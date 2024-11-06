import { IsArray, IsNotEmpty, IsUUID, ValidateNested, IsNotEmptyObject, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { IDatasetDetailMetadataUpdateDto } from '../../types'
import { DatasetCustomAttribute, DatasetDashboardBaseDto, DatasetDetailDto } from './dataset.dto'

export class DatasetDetailMetadataUpdateDto implements IDatasetDetailMetadataUpdateDto {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => DatasetDetailDto)
  detail: DatasetDetailDto

  @ValidateNested()
  @Type(() => DatasetDashboardBaseDto)
  @IsArray()
  dashboards: DatasetDashboardBaseDto[]

  @ValidateNested()
  @Type(() => DatasetCustomAttribute)
  @IsArray()
  attributes: DatasetCustomAttribute[]

  @IsArray()
  tags: string[]

  @IsNotEmpty()
  tokenDatasetCode: string

  type?: string

  @IsNotEmpty()
  visibilityStatus: string

  // @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  paConfigId: string
}
