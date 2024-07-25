import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DqdResult } from './entity'
import { PrefectAPI } from '../prefect/prefect.api'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { UtilsService } from '../utils/utils.service'
import { IDqdResultDto } from '../types'

@Injectable()
export class DqdService {
  constructor(
    // TODO: Remove unused dqdResultRepo and entity
    @InjectRepository(DqdResult) private readonly dqdResultRepo: Repository<DqdResult>,
    private readonly prefectApi: PrefectAPI,
    private readonly portalServerApi: PortalServerAPI,
    private readonly utilsService: UtilsService
  ) {}

  async getDqdResultByFlowRunId(flowRunId: string) {
    const result = await this.prefectApi.getFlowRunsArtifacts([flowRunId])
    if (result.length === 0) {
      throw new InternalServerErrorException(`No DQD result with flowRunId: ${flowRunId} was found`)
    }

    const match = this.utilsService.regexMatcher(result)
    const filePath = []
    if (match) {
      const s3Path = match[0].slice(1, -1) // Removing the surrounding brackets []
      filePath.push(this.utilsService.extractRelativePath(s3Path))
      return await this.portalServerApi.getFlowRunResults(filePath)
    }
    throw new InternalServerErrorException(`Invalid S3 path found`)
  }

  async getDqdResults(dqdResultDto: IDqdResultDto) {
    const results = await this.prefectApi.getFlowRunsArtifacts(dqdResultDto.flowRunIds)
    if (results.length === 0) {
      console.log(`No flow run artifacts result found for flowRunIds: ${dqdResultDto.flowRunIds}`)
      return results
    }
    const match = this.utilsService.regexMatcher(results)
    const filePaths = []
    if (match) {
      for (const m of match) {
        const s3Path = m.slice(1, -1) // Removing the surrounding brackets []
        const filePath = this.utilsService.extractRelativePath(s3Path)
        filePaths.push(filePath)
      }
      return await this.portalServerApi.getFlowRunResults(filePaths)
    }
    throw new InternalServerErrorException(`Invalid S3 path found`)
  }
}
