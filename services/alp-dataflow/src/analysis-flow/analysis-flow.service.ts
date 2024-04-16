import { Inject, Injectable, Scope } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { Repository } from 'typeorm'
import { JwtPayload, decode } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { IDataflowDto, IDataflowDuplicateDto } from '../types'
import { Analysisflow, AnalysisflowRevision, AnalysisflowResult, AnalysisflowRun } from './entity'
import { createLogger } from '../logger'
import { BadRequestException } from '@nestjs/common'

@Injectable({ scope: Scope.REQUEST })
export class AnalysisflowService {
  private readonly logger = createLogger(this.constructor.name)
  private readonly userId: string

  constructor(
    @Inject(REQUEST) request: Request,
    @InjectRepository(Analysisflow) private readonly analysisflowRepo: Repository<Analysisflow>,
    @InjectRepository(AnalysisflowRevision) private readonly analysisflowRevisionRepo: Repository<AnalysisflowRevision>,
    @InjectRepository(AnalysisflowResult) private readonly analysisflowResultRepo: Repository<AnalysisflowResult>,
    @InjectRepository(AnalysisflowRun) private readonly analysisflowRunRepo: Repository<AnalysisflowRun>
  ) {
    const token = decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload
    this.userId = token.sub
  }

  async getAnalysisflow(id: string) {
    return await this.analysisflowRepo
      .createQueryBuilder('analysisflow')
      .leftJoin('analysisflow.revisions', 'revision')
      .select([
        'analysisflow.id',
        'analysisflow.name',
        'revision.id',
        'revision.flow',
        'revision.comment',
        'revision.createdDate',
        'revision.createdBy',
        'revision.version'
      ])
      .where('analysisflow.id = :id', { id })
      .orderBy('revision.createdDate')
      .getOne()
  }

  async getLastAnalysisflowRevision(id: string) {
    const revision = await this.analysisflowRevisionRepo
      .createQueryBuilder('revision')
      .leftJoin('revision.analysisflow', 'analysisflow')
      .select([
        'analysisflow.id',
        'analysisflow.name',
        'analysisflow.lastFlowRunId',
        'revision.id',
        'revision.flow',
        'revision.comment',
        'revision.createdDate',
        'revision.createdBy',
        'revision.version'
      ])
      .where('analysisflow.id = :id', { id })
      .orderBy('revision.createdDate', 'DESC')
      .getOne()
    if (revision) {
      return {
        id: revision.analysisflow.id,
        name: revision.analysisflow.name,
        lastFlowRunId: revision.analysisflow.lastFlowRunId,
        flow: revision.flow,
        version: revision.version
      }
    }
    return null
  }

  async getTaskRunResult(taskRunId: string) {
    const result = await this.analysisflowResultRepo
      .createQueryBuilder('result')
      .select([
        'result.taskRunId',
        'result.rootFlowRunId',
        'result.flowRunId',
        'result.taskRunResult',
        'result.createdDate'
      ])
      .where('result.taskRunId = :taskRunId', { taskRunId: taskRunId })
      .getOne()

    if (result) {
      return result
    }
    return null
  }

  async getFlowRunResultsByAnalysisflowId(analysisflowId: string) {
    const latestRun = await this.analysisflowRunRepo
      .createQueryBuilder('run')
      .select('run.rootFlowRunId')
      .leftJoinAndSelect('run.results', 'analysisflowResults')
      .where('run.analysisflowId = :analysisflowId', { analysisflowId })
      .orderBy('run.createdDate', 'DESC')
      .getOne()
    const results = latestRun?.results

    return results ? results : []
  }

  async getAnalysisflows() {
    return await this.analysisflowRepo.createQueryBuilder('analysisflow').getMany()
  }

  async createAnalysisflow(analysisflowDto: IDataflowDto) {
    const analysisflowEntity = this.analysisflowRepo.create({
      id: analysisflowDto.id ? analysisflowDto.id : uuidv4(),
      name: analysisflowDto.name
    })
    let version = 1
    const { comment, ...flow } = analysisflowDto.dataflow

    if (analysisflowDto.id) {
      const lastDataflowRevision = await this.getLastAnalysisflowRevision(analysisflowDto.id)
      version += lastDataflowRevision.version
      await this.analysisflowRepo.update(analysisflowDto.id, this.addOwner(analysisflowEntity))
    } else {
      await this.analysisflowRepo.insert(this.addOwner(analysisflowEntity, true))
      this.logger.info(`Created new analysisflow ${analysisflowEntity.name} with id ${analysisflowEntity.id}`)
    }

    const revisionEntity = this.analysisflowRevisionRepo.create({
      id: uuidv4(),
      analysisflowId: analysisflowEntity.id,
      flow,
      comment,
      version
    })
    await this.analysisflowRevisionRepo.insert(this.addOwner(revisionEntity, true))
    this.logger.info(`Created new revision for analysisflow ${analysisflowEntity.name} with id ${revisionEntity.id}`)
    return {
      id: analysisflowEntity.id,
      revisionId: revisionEntity.id,
      version: revisionEntity.version
    }
  }

  async deleteAnalysisflow(id: string) {
    await this.analysisflowRepo.delete(id)
    return { id }
  }

  async createAnalysisflowRun(id, prefectflowRunId) {
    const analysisflowRunEntity = this.analysisflowRunRepo.create({
      analysisflowId: id,
      rootFlowRunId: prefectflowRunId
    })
    await this.analysisflowRunRepo.insert(this.addOwner(analysisflowRunEntity, true))
    await this.analysisflowRepo.update({ id }, { lastFlowRunId: prefectflowRunId })
    this.logger.info(`Created analysisflow run for analysisflow (${id}) and prefect flow run (${prefectflowRunId})`)
  }

  private addOwner<T>(object: T, isNewEntity = false) {
    if (isNewEntity) {
      return {
        ...object,
        createdBy: this.userId,
        modifiedBy: this.userId
      }
    }
    return {
      ...object,
      modifiedBy: this.userId
    }
  }

  async duplicateAnalysisflow(id: string, revisionId: string, analysisflowDuplicateDto: IDataflowDuplicateDto) {
    const flowEntity = await this.getAnalysisflow(id)
    const revisionEntity = flowEntity.revisions.find(r => r.id === revisionId)

    if (!revisionEntity) {
      throw new BadRequestException('Analysisflow Revision does not exist')
    }
    const newAnalysisflowEntity = this.addOwner(
      this.analysisflowRepo.create({
        id: uuidv4(),
        name: analysisflowDuplicateDto.name
      }),
      true
    )
    const newRevisionEntity = this.addOwner(
      this.analysisflowRevisionRepo.create({
        id: uuidv4(),
        analysisflowId: newAnalysisflowEntity.id,
        flow: revisionEntity.flow,
        version: 1
      }),
      true
    )

    await this.analysisflowRepo.insert(newAnalysisflowEntity)
    await this.analysisflowRevisionRepo.insert(newRevisionEntity)
    this.logger.info(
      `Created new revision for analysisflow ${newAnalysisflowEntity.name} with id ${newRevisionEntity.id}`
    )
    return {
      id: newAnalysisflowEntity.id,
      revisionId: newRevisionEntity.id,
      version: newRevisionEntity.version
    }
  }

  async deleteAnalysisflowRevision(flowId: string, revisionId: string) {
    const flowEntity = await this.getAnalysisflow(flowId)
    if (flowEntity && flowEntity.revisions.find(r => r.id === revisionId)) {
      await this.analysisflowRevisionRepo.delete(revisionId)
      this.logger.info(`Deleted analysisflow revision with id ${revisionId}`)

      const lastRev = await this.getLastAnalysisflowRevision(flowId)
      if (!lastRev) {
        await this.analysisflowRepo.delete(flowId)
      }
      return {
        revisionId
      }
    }

    throw new BadRequestException('Analysisflow and/or analysisflow revision do not match')
  }
}
