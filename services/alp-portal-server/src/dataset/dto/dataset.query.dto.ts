import { Transform, Type } from 'class-transformer'
import { IsArray, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, ValidateIf, ValidateNested } from 'class-validator'
import { DatasetQueryRole, IDatasetQueryDto } from '../../types'
import { DATASET_QUERY_ROLES, DomainRequirement } from '../../common/const'

class NumberFilterDto {
  @IsNumber()
  @Type(() => Number)
  gte: number
  @IsNumber()
  @Type(() => Number)
  lte: number
}

export class DatasetQueryDto implements IDatasetQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => value.split(','))
  tenants: string[]

  @IsOptional()
  @IsNotEmpty()
  @IsIn(DATASET_QUERY_ROLES)
  role?: DatasetQueryRole

  @ValidateIf(o => o.role === 'researcher')
  @ValidateNested()
  @Type(() => NumberFilterDto)
  @IsOptional()
  age?: NumberFilterDto

  @ValidateIf(o => o.role === 'researcher')
  @ValidateNested()
  @Type(() => NumberFilterDto)
  @IsOptional()
  // observationYear
  obsYr?: NumberFilterDto

  @ValidateIf(o => o.role === 'researcher')
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  // minCumulativeObservationMonth
  minObsMth?: number

  @ValidateIf(o => o.role === 'researcher')
  @IsOptional()
  @IsArray()
  @IsEnum(DomainRequirement, { each: true })
  @Transform(({ value }) => value.split(','))
  domains?: DomainRequirement[]
}
