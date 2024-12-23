import { Injectable, InternalServerErrorException, NotFoundException, SCOPE } from '@danet/core'
import { RequestContextService } from '../common/request-context.service.ts'
import { createLogger } from '../logger.ts'
import { IConfig, IConfigUpdateDto } from '../types.d.ts'
import { Config } from './entity/config.entity.ts'
import { ConfigRepository } from './repository/config.repository.ts'

@Injectable({ scope: SCOPE.REQUEST })
export class ConfigService {
  private readonly logger = createLogger(this.constructor.name)
  private readonly userId: string | undefined

  constructor(
    private overviewDescriptionRepo: ConfigRepository,
    private requestContextService: RequestContextService
  ) {
    this.userId = this.requestContextService.getAuthToken()?.sub
  }

  async getConfigByType(type: string): Promise<Config | null> {
    try {
      return await this.overviewDescriptionRepo.findOneOrFail(type)
    } catch (error) {
      console.log(`Error getting config of type ${type}: ${error}`)
      this.logger.error(`Error getting config of type ${type}: ${error}`)
      throw new InternalServerErrorException()
    }
  }

  async updateConfig(configUpdateDto: IConfigUpdateDto): Promise<IConfig> {
    try {
      await this.overviewDescriptionRepo.update({ type: configUpdateDto.type }, this.addOwner(configUpdateDto))
      this.logger.info(`Config of type: ${configUpdateDto.type} updated`)
      return configUpdateDto
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new NotFoundException();
      }
      throw error;
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
