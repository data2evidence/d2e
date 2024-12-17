import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors
} from '@danet/core'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Response } from 'express'
import { MulterError } from 'npm:multer'
import { ResourceService } from './resource.service.ts'

// TODO: Make upload and download work
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) { }

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
