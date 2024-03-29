import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DqdResult } from './entity'
import { IDqdResultDto } from '../types'

@Injectable()
export class DqdService {
  constructor(@InjectRepository(DqdResult) private readonly dqdResultRepo: Repository<DqdResult>) {}

  async getDqdResultByFlowRunId(flowRunId: string) {
    const result = await this.dqdResultRepo
      .createQueryBuilder('results')
      .select(['results.flowRunId', 'results.result'])
      .where('results.flowRunId = :flowRunId', { flowRunId: flowRunId })
      .getOne()

    if (result) {
      return result
    }
    return null
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
}
