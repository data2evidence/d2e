import { IsDate, IsNotEmpty } from 'class-validator'
import { IDatasetReleaseDto } from '../../types'
import { Transform } from 'class-transformer'

export class DatasetReleaseDto implements IDatasetReleaseDto {
  @IsNotEmpty()
  datasetId: string

  @IsNotEmpty()
  name: string

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  releaseDate: Date
}
