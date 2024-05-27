import { IsOptional } from 'class-validator'
import { IPublicDatasetQueryDto } from '../../types'

export class PublicDatasetQueryDto implements IPublicDatasetQueryDto {
  @IsOptional()
  searchText?: string
}
