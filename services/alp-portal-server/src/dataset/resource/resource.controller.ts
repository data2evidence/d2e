import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterError } from 'multer'
import type { Response } from 'express'
import { ResourceService } from './resource.service'

@Controller()
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('list')
  async getResources(@Query('datasetId', ParseUUIDPipe) datasetId) {
    return await this.resourceService.getResources(datasetId)
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, cb) => {
        const fileName = file.originalname
        const invalidFileError = new MulterError('LIMIT_UNEXPECTED_FILE', 'file')

        if (fileName.includes('\\') || fileName.includes('/')) {
          cb(invalidFileError, false)
        } else {
          cb(null, true)
        }
      }
    })
  )
  async uploadResource(
    @Query('datasetId', ParseUUIDPipe) datasetId: string,
    @UploadedFile()
    file: Express.Multer.File
  ) {
    return await this.resourceService.uploadResource(datasetId, file)
  }

  @Get(':fileName/download')
  async downloadResource(
    @Query('datasetId', ParseUUIDPipe) datasetId: string,
    @Param('fileName') fileName: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.resourceService.downloadResource(datasetId, fileName)
    res.set({
      'Content-Type': result.contentType,
      'Content-Disposition': result.contentDisposition
    })
    return new StreamableFile(result.readStream)
  }

  @Delete(':fileName')
  async deleteResource(@Query('datasetId', ParseUUIDPipe) datasetId: string, @Param('fileName') fileName: string) {
    return await this.resourceService.deleteResource(datasetId, fileName)
  }
}
