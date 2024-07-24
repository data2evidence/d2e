import { Inject, Injectable, Scope } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { Repository } from 'typeorm'
import { JwtPayload, decode } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { IDataflowDto, IDataflowDuplicateDto } from '../types'
import { Dataflow, DataflowRevision, DataflowResult, DataflowRun } from './entity'
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
    @InjectRepository(DataflowResult) private readonly dataflowResultRepo: Repository<DataflowResult>,
    @InjectRepository(DataflowRun) private readonly dataflowRunRepo: Repository<DataflowRun>,
    private readonly portalServerApi: PortalServerAPI,
    private readonly prefectApi: PrefectAPI
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
  // TODO: Replace to using prefect result
  async getTaskRunResult(taskRunId: string) {
    const result = await this.dataflowResultRepo
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
  // TODO: Replace to using prefect result
  async getFlowRunResultsByDataflowId(dataflowId: string) {
    const latestRun = await this.dataflowRunRepo
      .createQueryBuilder('run')
      .select('run.rootFlowRunId')
      .leftJoinAndSelect('run.results', 'dataflowResults')
      .where('run.dataflowId = :dataflowId', { dataflowId })
      .orderBy('run.createdDate', 'DESC')
      .getOne()
    const results = latestRun?.results
    if (!results) {
      return []
    }
    // TODO: Replace the flowRunId to get from dataflow_run table directly
    const flowRunId = results[0].flowRunId
    const flowResult = await this.prefectApi.getFlowRunsArtifacts([flowRunId])

    if (flowResult.length === 0) {
      console.log(`No flow run artifacts result found for flowRunId: ${flowRunId}`)
      return flowResult
    }
    console.log(JSON.stringify(flowResult))
    const match = this.regexMatcher(flowResult)
    const filePath = []
    if (match) {
      for (const m of match) {
        const s3Path = match[0].slice(1, -1) // Removing the surrounding brackets []
        filePath.push(this.extractRelativePath(s3Path))
      }
      console.log(`filePath: ${filePath}`)
      const res = await this.portalServerApi.getFlowRunResults(filePath)
      console.log(`res: ${res}`)

      // TODO: replace the hardcoded transformed result
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

  async createDataflowRun(id, prefectflowRunId) {
    const dataflowRunEntity = this.dataflowRunRepo.create({
      dataflowId: id,
      rootFlowRunId: prefectflowRunId
    })
    await this.dataflowRunRepo.insert(this.addOwner(dataflowRunEntity, true))
    await this.dataflowRepo.update({ id }, { lastFlowRunId: prefectflowRunId })
    this.logger.info(`Created dataflow run for dataflow (${id}) and prefect flow run (${prefectflowRunId})`)
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

  private regexMatcher(result) {
    const regex = /\[s3:\/\/[^)]+\]/ // To match [s3://flows/results/<flowRunID>_dqd/dc.json]
    return result
      .map(item => item.description.match(regex)) // Extract matches for each item
      .filter(match => match) // Filter out null matches
      .flat()
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
