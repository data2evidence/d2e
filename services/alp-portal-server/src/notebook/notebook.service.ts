import { Inject, Injectable, InternalServerErrorException, NotFoundException, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { INotebook, INotebookBaseDto, INotebookUpdateDto } from '../types'
import { DEFAULT_ERROR_MESSAGE } from '../common/const'
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '../logger'
import { JwtPayload, decode } from 'jsonwebtoken'
import { UserArtifactService } from '../user-artifact/user-artifact.service'
import { ServiceName } from '../user-artifact/enums'

@Injectable({ scope: Scope.REQUEST })
export class NotebookService {
  private readonly logger = createLogger(this.constructor.name)
  private readonly userId: string

  constructor(@Inject(REQUEST) request: Request, private readonly userArtifactService: UserArtifactService) {
    const token = decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload
    this.userId = token.sub
  }

  async getNotebooksByUserId(): Promise<any[]> {
    try {
      const userNotebooks = await this.userArtifactService.getAllUserServiceArtifacts(
        ServiceName.NOTEBOOKS,
        this.userId
      )

      return userNotebooks
    } catch (error) {
      this.logger.error(`Error while getting notebooks for user id ${this.userId}: ${error}`)
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  async createNotebook(notebookDto: INotebookBaseDto): Promise<INotebook> {
    try {
      const notebookEntity = this.addOwner(
        {
          ...notebookDto,
          id: uuidv4(),
          userId: this.userId,
          isShared: false
        },
        true
      )
      await this.userArtifactService.createServiceArtifact({
        serviceName: ServiceName.NOTEBOOKS,
        serviceArtifact: notebookEntity
      })
      this.logger.info(`Created new notebook ${notebookEntity.name} with id ${notebookEntity.id}`)
      return notebookEntity
    } catch (error) {
      this.logger.error(`Error while creating new notebook: ${error}`)
      throw new InternalServerErrorException(DEFAULT_ERROR_MESSAGE)
    }
  }

  async updateNotebook(notebookUpdateDto: INotebookUpdateDto): Promise<INotebook> {
    try {
      const notebook = await this.userArtifactService.getServiceArtifactById(
        this.userId,
        ServiceName.NOTEBOOKS,
        notebookUpdateDto.id
      )

      if (notebook.userId !== this.userId) {
        this.logger.error('Notebook does not belong to user!')
        throw new InternalServerErrorException('Notebook does not belong to user!')
      }

      const updatedServiceEntity = this.addOwner({
        userId: this.userId,
        id: notebookUpdateDto.id,
        serviceArtifact: notebookUpdateDto
      })
      await this.userArtifactService.updateServiceArtifact(ServiceName.NOTEBOOKS, updatedServiceEntity)

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
      await this.userArtifactService.deleteServiceArtifact(this.userId, ServiceName.NOTEBOOKS, id)
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
    const notebook = await this.userArtifactService.getServiceArtifactById(this.userId, ServiceName.NOTEBOOKS, id)
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
