import { IsNotEmpty } from 'class-validator'
import { IDatasetSearchDto } from '../../types'

export class DatasetSearchDto implements IDatasetSearchDto {
  @IsNotEmpty()
  tokenDatasetCode: string
}
