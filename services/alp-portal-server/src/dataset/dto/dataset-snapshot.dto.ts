import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { Transform } from 'class-transformer'
import { IDatasetSnapshotDto } from '../../types'

export class DatasetSnapshotDto implements IDatasetSnapshotDto {
  @IsUUID()
  id: string

  @IsUUID()
  sourceDatasetId: string

  @IsNotEmpty()
  @IsString()
  newDatasetName: string

  @IsNotEmpty()
  @IsString()
  schemaName: string

  @Transform(({ value }) => new Date(value))
  @IsDate()
  timestamp: Date
}
