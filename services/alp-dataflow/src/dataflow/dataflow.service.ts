import { Inject, Injectable, Scope } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { Repository } from 'typeorm'
import { JwtPayload, decode } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { IDataflowDto, IDataflowDuplicateDto } from '../types'
import { Dataflow, DataflowRevision } from './entity'
import { UtilsService } from '../utils/utils.service'
import { PortalServerAPI } from '../portal-server/portal-server.api'
import { PrefectAPI } from '../prefect/prefect.api'
import { createLogger } from '../logger'
import { BadRequestException, InternalServerErrorException } from '@nestjs/common'

@Injectable({ scope: Scope.REQUEST })
export class DataflowService {
  private readonly logger = createLogger(this.constructor.name)
  private readonly userId: string

  constructor(
    @Inject(REQUEST) request: Request,
    @InjectRepository(Dataflow) private readonly dataflowRepo: Repository<Dataflow>,
    @InjectRepository(DataflowRevision) private readonly dataflowRevisionRepo: Repository<DataflowRevision>,
    private readonly portalServerApi: PortalServerAPI,
    private readonly prefectApi: PrefectAPI,
    private readonly utilsService: UtilsService
  ) {
    const token = decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload
    this.userId = token.sub
  }

  async getDataflow(id: string) {
    return await this.dataflowRepo
      .createQueryBuilder('dataflow')
      .leftJoin('dataflow.revisions', 'revision')
      .select([
        'dataflow.id',
        'dataflow.name',
        'revision.id',
        'revision.flow',
        'revision.comment',
        'revision.createdDate',
        'revision.createdBy',
        'revision.version'
      ])
      .where('dataflow.id = :id', { id })
      .orderBy('revision.createdDate')
      .getOne()
  }

  async getLastDataflowRevision(id: string) {
    const revision = await this.dataflowRevisionRepo
      .createQueryBuilder('revision')
      .leftJoin('revision.dataflow', 'dataflow')
      .select([
        'dataflow.id',
        'dataflow.name',
        'dataflow.lastFlowRunId',
        'revision.id',
        'revision.flow',
        'revision.comment',
        'revision.createdDate',
        'revision.createdBy',
        'revision.version'
      ])
      .where('dataflow.id = :id', { id })
      .orderBy('revision.createdDate', 'DESC')
      .getOne()
    if (revision) {
      return {
        id: revision.dataflow.id,
        name: revision.dataflow.name,
        lastFlowRunId: revision.dataflow.lastFlowRunId,
        flow: revision.flow,
        version: revision.version
      }
    }
    return null
  }
  // TODO: check use case, deprecate if not in use
  // async getTaskRunResult(taskRunId: string) {
  //   const result = await this.dataflowResultRepo
  //     .createQueryBuilder('result')
  //     .select([
  //       'result.taskRunId',
  //       'result.rootFlowRunId',
  //       'result.flowRunId',
  //       'result.taskRunResult',
  //       'result.createdDate'
  //     ])
  //     .where('result.taskRunId = :taskRunId', { taskRunId: taskRunId })
  //     .getOne()

  //   if (result) {
  //     return result
  //   }
  //   return null
  // }

  async getFlowRunResultsByDataflowId(dataflowId: string) {
    const lastFlowRun = await this.dataflowRepo
      .createQueryBuilder('dataflow')
      .select('dataflow.lastFlowRunId')
      .where('dataflow.id = :dataflowId', { dataflowId })
      .getOne()

    const lastFlowRunId = lastFlowRun?.lastFlowRunId
    const subflowRuns = await this.prefectApi.getFlowRunsByParentFlowRunId(lastFlowRunId)
    const flowRunIds = subflowRuns.map(flow => flow.id)
    const flowResult = await this.prefectApi.getFlowRunsArtifacts(subflowRuns.map(item => item.id))

    if (flowResult.length === 0) {
      console.log(`No flow run artifacts result found for flowRunIds: ${flowRunIds}`)
      return []
    }
    // regex will only match flow runs with description which has path
    const match = this.utilsService.regexMatcher(flowResult)
    const filePath = []
    if (match) {
      for (const m of match) {
        const s3Path = m.slice(1, -1) // Removing the surrounding brackets []
        filePath.push(this.utilsService.extractRelativePath(s3Path))
      }
      const res = await this.portalServerApi.getFlowRunResults(filePath)

      // TODO: replace the hardcoded transformed after persisted result been updated
      const transformedRes = res.map((result, index) => ({
        nodeName: `p${index + 1}`,
        taskRunResult: {
          result
        },
        error: false,
        errorMessage: null
      }))
      return transformedRes
    }
    throw new InternalServerErrorException(`Invalid S3 path found`)
  }

  async getDataflows() {
    return await this.dataflowRepo.createQueryBuilder('dataflow').getMany()
  }

  async createDataflow(dataflowDto: IDataflowDto) {
    const dataflowEntity = this.dataflowRepo.create({
      id: dataflowDto.id ? dataflowDto.id : uuidv4(),
      name: dataflowDto.name
    })
    let version = 1
    const { comment, ...flow } = dataflowDto.dataflow

    if (dataflowDto.id) {
      const lastDataflowRevision = await this.getLastDataflowRevision(dataflowDto.id)
      version += lastDataflowRevision.version
      await this.dataflowRepo.update(dataflowDto.id, this.addOwner(dataflowEntity))
    } else {
      await this.dataflowRepo.insert(this.addOwner(dataflowEntity, true))
      this.logger.info(`Created new dataflow ${dataflowEntity.name} with id ${dataflowEntity.id}`)
    }

    const revisionEntity = this.dataflowRevisionRepo.create({
      id: uuidv4(),
      dataflowId: dataflowEntity.id,
      flow,
      comment,
      version
    })
    await this.dataflowRevisionRepo.insert(this.addOwner(revisionEntity, true))
    this.logger.info(`Created new revision for dataflow ${dataflowEntity.name} with id ${revisionEntity.id}`)
    return {
      id: dataflowEntity.id,
      revisionId: revisionEntity.id,
      version: revisionEntity.version
    }
  }

  async deleteDataflow(id: string) {
    await this.dataflowRepo.delete(id)
    return { id }
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

  async duplicateDataflow(id: string, revisionId: string, dataflowDuplicateDto: IDataflowDuplicateDto) {
    const flowEntity = await this.getDataflow(id)
    const revisionEntity = flowEntity.revisions.find(r => r.id === revisionId)

    if (!revisionEntity) {
      throw new BadRequestException('Dataflow Revision does not exist')
    }
    const newDataflowEntity = this.addOwner(
      this.dataflowRepo.create({
        id: uuidv4(),
        name: dataflowDuplicateDto.name
      }),
      true
    )
    const newRevisionEntity = this.addOwner(
      this.dataflowRevisionRepo.create({
        id: uuidv4(),
        dataflowId: newDataflowEntity.id,
        flow: revisionEntity.flow,
        version: 1
      }),
      true
    )

    await this.dataflowRepo.insert(newDataflowEntity)
    await this.dataflowRevisionRepo.insert(newRevisionEntity)
    this.logger.info(`Created new revision for dataflow ${newDataflowEntity.name} with id ${newRevisionEntity.id}`)
    return {
      id: newDataflowEntity.id,
      revisionId: newRevisionEntity.id,
      version: newRevisionEntity.version
    }
  }

  async deleteDataflowRevision(flowId: string, revisionId: string) {
    const flowEntity = await this.getDataflow(flowId)
    if (flowEntity && flowEntity.revisions.find(r => r.id === revisionId)) {
      await this.dataflowRevisionRepo.delete(revisionId)
      this.logger.info(`Deleted dataflow revision with id ${revisionId}`)

      const lastRev = await this.getLastDataflowRevision(flowId)
      if (!lastRev) {
        await this.dataflowRepo.delete(flowId)
      }
      return {
        revisionId
      }
    }

    throw new BadRequestException('Dataflow and/or dataflow revision do not match')
  }
}
