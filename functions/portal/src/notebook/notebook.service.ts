import { Injectable, InternalServerErrorException, NotFoundException, SCOPE } from '@danet/core'
import { v4 as uuidv4 } from 'npm:uuid'
import { DEFAULT_ERROR_MESSAGE } from '../common/const.ts'
import { RequestContextService } from '../common/request-context.service.ts'
import { createLogger } from '../logger.ts'
import { INotebook, INotebookBaseDto, INotebookUpdateDto } from '../types.d.ts'
import { ServiceName } from '../user-artifact/enums/index.ts'
import { UserArtifactService } from '../user-artifact/user-artifact.service.ts'

@Injectable({ scope: SCOPE.REQUEST })
export class NotebookService {
  private readonly logger = createLogger(this.constructor.name)
  private readonly userId: string

  constructor(private readonly userArtifactService: UserArtifactService, private readonly requestContextService: RequestContextService) {
    this.userId = this.requestContextService.getAuthToken()?.sub
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
      await this.userArtifactService.createServiceArtifact(ServiceName.NOTEBOOKS, {
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
      const notebook = await this.userArtifactService.getUserServiceArtifactById(
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
      await this.userArtifactService.updateServiceArtifactEntity(ServiceName.NOTEBOOKS, updatedServiceEntity)

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

  async deleteNotebook(id: string): Promise<any> {
    try {
      const notebook = await this.getNotebook(id)
      await this.userArtifactService.deleteUserServiceArtifact(this.userId, ServiceName.NOTEBOOKS, id)
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
    const notebook = await this.userArtifactService.getUserServiceArtifactById(this.userId, ServiceName.NOTEBOOKS, id)
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
