import { IsString } from 'class-validator'
import { IMetadataConfigTag } from '../../types'

export class MetadataConfigTagDto implements IMetadataConfigTag {
  @IsString()
  name: string
}
