import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { NotebookBaseDto, NotebookUpdateDto } from './dto'
import { NotebookService } from './notebook.service'

@Controller()
export class NotebookController {
  constructor(private readonly notebookService: NotebookService) {}

  @Get()
  async getNotebooksByUserId() {
    return await this.notebookService.getNotebooksByUserId()
  }

  @Post()
  async createNotebook(@Body() notebookBaseDto: NotebookBaseDto) {
    const notebookDto: NotebookBaseDto = {
      name: notebookBaseDto.name,
      notebookContent: notebookBaseDto.notebookContent
    }
    return await this.notebookService.createNotebook(notebookDto)
  }

  @Put()
  async updateNotebook(@Body() notebookUpdateDto: NotebookUpdateDto) {
    return await this.notebookService.updateNotebook(notebookUpdateDto)
  }

  @Delete(':id')
  async deleteNotebook(@Param('id') id: string) {
    return await this.notebookService.deleteNotebook(id)
  }
}
