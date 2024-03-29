import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { INotebookUpdateDto } from '../../types'

export class NotebookUpdateDto implements INotebookUpdateDto {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @IsString()
  name: string

  @IsString()
  notebookContent: string

  @IsBoolean()
  isShared: boolean
}
