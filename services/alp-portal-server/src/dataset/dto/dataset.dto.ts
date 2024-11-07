import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
  ValidateIf,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'
import {
  CdmSchemaOption,
  DatabaseDialect,
  IDatasetAttribute,
  IDatasetDashboardBaseDto,
  IDatasetDetailBaseDto,
  IDatasetDto,
  VisibilityStatus
} from '../../types'
import { IsDatasetAttributeValueValid } from '../validator/dataset-attribute.validator'
import { CDM_SCHEMA_OPTIONS, DATABASE_DIALECTS, VISIBILITY_STATUS } from '../../common/const'

export class DatasetDetailDto implements IDatasetDetailBaseDto {
  @IsNotEmpty()
  name: string

  summary: string

  description: string

  @IsBoolean()
  showRequestAccess: boolean
}

export class DatasetDashboardBaseDto implements IDatasetDashboardBaseDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  url: string

  @IsString()
  @IsNotEmpty()
  basePath: string
}

export class DatasetCustomAttribute implements IDatasetAttribute {
  @IsNotEmpty()
  attributeId: string

  @IsNotEmpty()
  @Validate(IsDatasetAttributeValueValid)
  value: string
}

export class DatasetDto implements IDatasetDto {
  @IsNotEmpty()
  @IsUUID()
  id: string

  type?: string

  @IsNotEmpty()
  tokenDatasetCode: string

  @IsNotEmpty()
  @IsUUID()
  tenantId: string

  @IsNotEmpty()
  @IsIn(CDM_SCHEMA_OPTIONS)
  schemaOption: CdmSchemaOption

  @ValidateIf(o => o.schemaOption !== 'no_cdm')
  @IsNotEmpty()
  @IsIn(DATABASE_DIALECTS)
  dialect: DatabaseDialect

  @ValidateIf(o => o.schemaOption !== 'no_cdm')
  @IsNotEmpty()
  databaseCode: string

  @ValidateIf(o => ['custom_cdm', 'existing_cdm'].includes(o.schemaOption))
  @IsNotEmpty()
  schemaName: string

  @ValidateIf(o => ['custom_cdm', 'existing_cdm'].includes(o.schemaOption))
  @IsNotEmpty()
  vocabSchemaName: string

  @ValidateIf(o => o.schemaOption !== 'no_cdm')
  @IsNotEmpty()
  dataModel: string

  // @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  paConfigId: string

  @IsNotEmpty()
  @IsIn(VISIBILITY_STATUS)
  visibilityStatus: VisibilityStatus

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
}
