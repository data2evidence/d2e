import { IsNotEmpty, IsString } from 'class-validator'
import { INotebookBaseDto } from '../../types'

export class NotebookBaseDto implements INotebookBaseDto {
  @IsNotEmpty()
  @IsString()
  name: string

  notebookContent: string
}
