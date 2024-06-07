import { Transform } from 'class-transformer'
import { IsArray, IsDate, IsEnum, IsIn, IsOptional, IsString } from 'class-validator'
import { IJobHistoryQueryDto } from '../../types'
import { FlowRunState } from '../../common/const'

export class JobHistoryQueryDto implements IJobHistoryQueryDto {
  @IsString()
  @IsIn(['dqd', 'all'])
  filter: 'dqd' | 'all'

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate?: Date

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate?: Date

  @IsOptional()
  @IsArray()
  @IsEnum(FlowRunState, { each: true })
  states?: FlowRunState[]

  @IsOptional()
  @IsArray()
  tags?: string[]

  @IsOptional()
  @IsArray()
  flowIds?: string[]

  @IsOptional()
  @IsArray()
  deploymentIds?: string[]

  @IsOptional()
  @IsArray()
  deploymentNames?: string[]

  @IsOptional()
  @IsArray()
  workPools?: string[]
}
