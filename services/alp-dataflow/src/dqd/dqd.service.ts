import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DqdResult } from './entity'
import { PrefectAPI } from 'src/prefect/prefect.api'
import { PortalServerAPI } from 'src/portal-server/portal-server.api'
import { IDqdResultDto } from '../types'

@Injectable()
export class DqdService {
  constructor(
    @InjectRepository(DqdResult) private readonly dqdResultRepo: Repository<DqdResult>,
    private readonly prefectApi: PrefectAPI,
    private readonly portalServerApi: PortalServerAPI
  ) {}

  async getDqdResultByFlowRunId(flowRunId: string) {
    const result = await this.dqdResultRepo
      .createQueryBuilder('results')
      .select(['results.flowRunId', 'results.result'])
      .where('results.flowRunId = :flowRunId', { flowRunId: flowRunId })
      .getOne()

    if (result) {
      return result
    }
  }

  async getDqdResultByTaskRunId(taskRunId: string) {
    const result = await this.prefectApi.getFlowRunsArtifacts(taskRunId)
    console.log(result)
    const regex = /\[s3:\/\/[^)]+\]/
    const match = result[0].description.match(regex)
    let filePath = ''
    if (match) {
      const s3Path = match[0].slice(1, -1) // Removing the surrounding brackets []
      filePath = this.extractRelativePath(s3Path)
    }
    const data = await this.portalServerApi.getFlowRunResults(filePath)
    return data
  }

  async getDqdResults(dqdResultDto: IDqdResultDto) {
    const query = this.dqdResultRepo.createQueryBuilder('result').select()
    if (dqdResultDto.flowRunId) {
      query.where('result.flowRunId = :flowRunId', { flowRunId: dqdResultDto.flowRunId })
    } else if (dqdResultDto.flowRunIds) {
      query.where('result.flowRunId IN(:...flowRunIds)', { flowRunIds: dqdResultDto.flowRunIds })
    }
    query.andWhere('result.error = false')
    return (await query.getMany()) || []
  }

  private extractRelativePath(path: string) {
    const prefix = 's3://flows/'
    const start = path.indexOf(prefix)
    if (start === -1) return null

    const end = path.indexOf(')', start)
    if (end === -1) return path.substring(start + prefix.length)

    return path.substring(start + prefix.length, end)
  }
}
