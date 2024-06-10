import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, EntityManager } from 'typeorm'
import { createLogger } from '../../logger'
import { DEFAULT_ERROR_MESSAGE } from '../const'

@Injectable()
export class TransactionRunner {
  private readonly logger = createLogger(this.constructor.name)
  constructor(
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  private async initDataSource() {
    if (!this.dataSource.isInitialized) {
      try {
        await this.dataSource.initialize()
      } catch (e) {
        this.logger.error(`Datasource initialisation has failed: ${e}`)
        throw new InternalServerErrorException('Datasource initialisation has failed')
      }
    }
  }

  async run<T>(fn: (entityMgr: EntityManager, arg: T) => any, arg: T) {
    await this.initDataSource()
    const queryRunner = this.dataSource.createQueryRunner()
    const entityMgr = queryRunner.manager
    await queryRunner.startTransaction()
    try {
      const result = await fn(entityMgr, arg)
      await queryRunner.commitTransaction()
      return result
    } catch (e) {
      this.logger.error(`Error occurred while executing ${fn.name}: ${e}`)
      await queryRunner.rollbackTransaction()
      if (e instanceof BadRequestException || e instanceof InternalServerErrorException) {
        throw e
      }
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    } finally {
      await queryRunner.release()
    }
  }
}
