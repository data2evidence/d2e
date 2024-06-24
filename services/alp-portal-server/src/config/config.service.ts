import { Inject, Injectable, InternalServerErrorException, NotFoundException, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { InjectRepository } from '@nestjs/typeorm'
import { IConfig, IConfigUpdateDto } from '../types'
import { Repository } from 'typeorm'
import { Config } from './entity'
import { DEFAULT_ERROR_MESSAGE } from '../common/const'
import { createLogger } from '../logger'
import { JwtPayload, decode } from 'jsonwebtoken'

@Injectable({ scope: Scope.REQUEST })
export class ConfigService {
  private readonly logger = createLogger(this.constructor.name)
  private readonly userId: string

  constructor(
    @Inject(REQUEST) request: Request,
    @InjectRepository(Config)
    private overviewDescriptionRepo: Repository<Config>
  ) {
    const token = request.headers['authorization']
      ? (decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload)
      : ''
    this.userId = token ? token.sub : ''
  }

  async getConfigByType(type: string): Promise<IConfig> {
    try {
      return await this.overviewDescriptionRepo.findOneOrFail({ where: { type } })
    } catch (error) {
      this.logger.error(`Config of type ${type} not found! ${error}`)
      throw new NotFoundException(`Config of type ${type} not found! ${error}`)
    }
  }

  async updateConfig(configUpdateDto: IConfigUpdateDto): Promise<IConfig> {
    try {
      await this.overviewDescriptionRepo.update({ type: configUpdateDto.type }, this.addOwner(configUpdateDto))
      this.logger.info(`Config of type: ${configUpdateDto.type} updated`)
      return configUpdateDto
    } catch (error) {
      this.logger.error(`Error while updating config: ${error}`)
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Config of type ${configUpdateDto.type} not found`)
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
