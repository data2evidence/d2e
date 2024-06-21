import { Inject, Injectable, InternalServerErrorException, NotFoundException, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { InjectRepository } from '@nestjs/typeorm'
import { IOverviewDescription, IOverviewDescriptionUpdateDto } from '../types'
import { Repository } from 'typeorm'
import { OverviewDescription } from './entity'
import { DEFAULT_ERROR_MESSAGE } from '../common/const'
import { createLogger } from '../logger'
import { JwtPayload, decode } from 'jsonwebtoken'

@Injectable({ scope: Scope.REQUEST })
export class OverviewDescriptionService {
  private readonly logger = createLogger(this.constructor.name)
  private readonly userId: string

  constructor(
    @Inject(REQUEST) request: Request,
    @InjectRepository(OverviewDescription)
    private overviewDescriptionRepo: Repository<OverviewDescription>
  ) {
    const token = request.headers['authorization']
      ? (decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload)
      : ''
    this.userId = token ? token.sub : ''
  }

  async getOverviewDescription(): Promise<IOverviewDescription> {
    try {
      const description = await this.overviewDescriptionRepo.findOneOrFail({ where: { createdBy: 'system' } })
      return description
    } catch (error) {
      this.logger.error(`Overview description not found! ${error}`)
      throw new NotFoundException('Overview description not found')
    }
  }

  async updateOverviewDescription(
    overviewDescriptionUpdateDto: IOverviewDescriptionUpdateDto
  ): Promise<IOverviewDescription> {
    try {
      await this.overviewDescriptionRepo.update(
        { id: overviewDescriptionUpdateDto.id },
        this.addOwner(overviewDescriptionUpdateDto)
      )
      this.logger.info(`Updated overview description`)
      return overviewDescriptionUpdateDto
    } catch (error) {
      this.logger.error(`Error while updating overview description: ${error}`)
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Overview description not found`)
      }
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
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
}
