import {
  Controller,
  Param,
  Body,
  ParseUUIDPipe,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseFilePipeBuilder,
  Req
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtPayload, decode } from 'jsonwebtoken'
import { Request } from 'express'
import { mkdirSync } from 'fs'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { PrefectService } from './prefect.service'
import { TestDataflowDto, PrefectAdhocFlowDto, PrefectFlowRunByDeploymentDto, PrefectFlowRunByMetadataDto } from './dto'
import { PREFECT_ADHOC_FLOW_FOLDER_PATH } from '../common/const'

@Controller()
export class PrefectController {
  constructor(private readonly prefectService: PrefectService) {}

  @Get('flow-run/:id')
  getFlowRun(@Param('id', ParseUUIDPipe) id: string) {
    return this.prefectService.getFlowRun(id)
  }

  @Get('flow-run/:flowRunId/task-runs')
  getTaskRuns(@Param('flowRunId', ParseUUIDPipe) flowRunId: string) {
    return this.prefectService.getTaskRuns(flowRunId)
  }

  @Post('flow-run/metadata')
  createFlowRunByMetadata(@Body() metadata: PrefectFlowRunByMetadataDto) {
    return this.prefectService.createFlowRunByMetadata(metadata)
  }

  @Post('flow-run/deployment')
  createFlowRunByDeployment(@Body() flowRun: PrefectFlowRunByDeploymentDto) {
    return this.prefectService.createFlowRunByDeployment(flowRun)
  }

  @Post('flow-run/:id')
  createFlowRun(@Param('id', ParseUUIDPipe) id: string) {
    return this.prefectService.createFlowRun(id)
  }

  @Post('flow-run/:id/cancellation')
  cancelFlowRun(@Param('id', ParseUUIDPipe) id: string) {
    return this.prefectService.cancelFlowRun(id)
  }

  @Get('flow-run/:id/logs')
  getFlowRunLogs(@Param('id', ParseUUIDPipe) id: string) {
    return this.prefectService.getFlowRunLogs(id)
  }

  @Get('flow-run/:id/state')
  getFlowRunState(@Param('id', ParseUUIDPipe) id: string) {
    return this.prefectService.getFlowRunState(id)
  }

  @Get('flow-run/:id/runs')
  getRunsForFlowRun(@Param('id', ParseUUIDPipe) id: string) {
    return this.prefectService.getRunsForFlowRun(id)
  }

  @Get('task-run/:id')
  getTaskRunState(@Param('id', ParseUUIDPipe) id: string) {
    return this.prefectService.getTaskRunState(id)
  }

  @Get('task-run/:id/logs')
  getTaskRunLogs(@Param('id', ParseUUIDPipe) id: string) {
    return this.prefectService.getTaskRunLogs(id)
  }

  @Post('test-run')
  createTestRun(@Body() testFlow: TestDataflowDto) {
    return this.prefectService.createTestRun(testFlow)
  }

  @Get('flow/metadata/list')
  getFlowDeploymentMetadata() {
    return this.prefectService.getFlowMetadata()
  }

  @Get('flow/datamodels/list')
  getDataModels() {
    return this.prefectService.getDataModels()
  }

  @Post('flow/file-deployment')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, cb) => {
        const fileName = file.originalname
        const allowedFileTypes = /(zip|gz)$/
        const hasValidFileType = allowedFileTypes.test(extname(fileName).toLowerCase())

        if (fileName.includes('\\') || fileName.includes('/')) {
          cb(new BadRequestException('File name is invalid'), false)
        } else if (!hasValidFileType) {
          cb(new BadRequestException('File type is invalid'), false)
        } else {
          cb(null, true)
        }
      },
      limits: {
        fileSize: 50000000
      },
      storage: diskStorage({
        destination: (req: Request, file, cb) => {
          const token = decode(req.headers['authorization'].replace(/bearer /i, '')) as JwtPayload
          const userId = token.sub
          // handle the case of uploading .tar.gz files
          const archiveExtensionRegex = /\.(tar\.gz|zip)$/
          const folderName = file.originalname.replace(archiveExtensionRegex, '')

          const deploymentFolderPath = join(PREFECT_ADHOC_FLOW_FOLDER_PATH, userId, folderName.replace(/[.-]/g, '_'))
          mkdirSync(deploymentFolderPath, { recursive: true })
          req.params['userId'] = userId
          cb(null, deploymentFolderPath)
        },
        filename: (_req, file, callback) => {
          callback(null, file.originalname)
        }
      })
    })
  )
  uploadFile(
    @UploadedFile(new ParseFilePipeBuilder().build({ fileIsRequired: true })) file: Express.Multer.File,
    @Param('userId') userId: string,
    @Body() adhocFlowDto: PrefectAdhocFlowDto
  ) {
    return this.prefectService.createFlowFileDeployment(userId, file, adhocFlowDto)
  }

  @Post('flow/git-deployment')
  uploadFromGit(@Req() request, @Body() adhocFlowDto: PrefectAdhocFlowDto) {
    const token = decode(request.headers.authorization.replace(/bearer /i, '')) as JwtPayload
    const userId = token.sub
    return this.prefectService.createFlowFileDeployment(userId, null, adhocFlowDto)
  }
}
