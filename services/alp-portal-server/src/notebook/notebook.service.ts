import { Inject, Injectable, InternalServerErrorException, NotFoundException, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { InjectRepository } from '@nestjs/typeorm'
import { INotebook, INotebookBaseDto, INotebookUpdateDto } from '../types'
import { Repository } from 'typeorm'
import { Notebook } from './entity'
import { DEFAULT_ERROR_MESSAGE } from '../common/const'
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '../logger'
import { JwtPayload, decode } from 'jsonwebtoken'

@Injectable({ scope: Scope.REQUEST })
export class NotebookService {
  private readonly logger = createLogger(this.constructor.name)
  private readonly userId: string

  constructor(
    @Inject(REQUEST) request: Request,
    @InjectRepository(Notebook)
    private notebookRepo: Repository<Notebook>
  ) {
    const token = decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload
    this.userId = token.sub
  }

  async getNotebooksByUserId(): Promise<INotebook[]> {
    try {
      const userNotebooks = await this.notebookRepo
        .createQueryBuilder('notebook')
        .where('notebook.user_id = :id OR notebook.is_shared = :isShared', { id: this.userId, isShared: true })
        .orderBy('notebook.modified_date', 'DESC')
        .getMany()

      return userNotebooks
    } catch (error) {
      this.logger.error(`Error while getting notebooks for user id ${this.userId}: ${error}`)
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  async createNotebook(notebookDto: INotebookBaseDto): Promise<INotebook> {
    try {
      const notebookEntity = this.notebookRepo.create({
        ...notebookDto,
        id: uuidv4(),
        userId: this.userId,
        isShared: false
      })
      await this.notebookRepo.insert(this.addOwner(notebookEntity, true))
      this.logger.info(`Created new notebook ${notebookEntity.name} with id ${notebookEntity.id}`)
      return notebookEntity
    } catch (error) {
      this.logger.error(`Error while creating new notebook: ${error}`)
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  async updateNotebook(notebookUpdateDto: INotebookUpdateDto): Promise<INotebook> {
    try {
      const notebook = await this.getNotebook(notebookUpdateDto.id)
      if (notebook.userId !== this.userId) {
        this.logger.error('Notebook does not belong to user!')
        throw new InternalServerErrorException('Notebook does not belong to user!')
      }
      await this.notebookRepo.update(
        { id: notebookUpdateDto.id, userId: this.userId },
        this.addOwner(notebookUpdateDto)
      )
      this.logger.info(`Updated notebook ${notebookUpdateDto.name}`)
      return {
        ...notebookUpdateDto,
        userId: this.userId
      }
    } catch (error) {
      this.logger.error(`Error while updating notebook ${notebookUpdateDto.id}: ${error}`)
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Notebook with id ${notebookUpdateDto.id} not found`)
      }
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  async deleteNotebook(id: string): Promise<INotebook> {
    try {
      const notebook = await this.getNotebook(id)
      await this.notebookRepo.delete({ id, userId: this.userId })
      return notebook
    } catch (error) {
      this.logger.error(`Error deleting notebook ${id}: ${error}`)
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Notebook with id ${id} not found`)
      }
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  private async getNotebook(id: string) {
    const notebook = await this.notebookRepo.findOne({
      where: [
        { id, userId: this.userId },
        { id, isShared: true }
      ]
    })
    if (!notebook) {
      throw new NotFoundException(`Notebook with id ${id} not found`)
    }
    return notebook
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
