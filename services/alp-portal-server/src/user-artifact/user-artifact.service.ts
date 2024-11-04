import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserArtifact } from './entity'
import { CreateArtifactDto, UpdateArtifactDto } from './dto'
import { ServiceName } from './enums'
import { REQUEST } from '@nestjs/core'
import { decode, JwtPayload } from 'jsonwebtoken'

@Injectable()
export class UserArtifactService {
  private readonly userId: string

  constructor(
    @Inject(REQUEST) request: Request,
    @InjectRepository(UserArtifact)
    private readonly userArtifactRepository: Repository<UserArtifact>
  ) {
    const token = decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload
    this.userId = token.sub
  }

  private defaultArtifact = {
    [ServiceName.DATAFLOW]: [],
    [ServiceName.DATAFLOW_REVISION]: [],
    [ServiceName.DATAFLOW_RUN]: [],
    [ServiceName.ANALYSIS_FLOW]: [],
    [ServiceName.ANALYSIS_FLOW_REVISION]: [],
    [ServiceName.ANALYSIS_FLOW_RUN]: [],
    [ServiceName.NOTEBOOKS]: [],
    [ServiceName.PA_CONFIG]: [],
    [ServiceName.CDW_CONFIG]: [],
    [ServiceName.BOOKMARKS]: []
  }

  private sharedConditionMap = {
    [ServiceName.NOTEBOOKS]: 'isShared'
  }

  async getServiceArtifact(userId: string, serviceName: ServiceName): Promise<any> {
    const artifact = await this.userArtifactRepository.findOne({
      where: { userId }
    })
    const result = artifact?.artifacts[serviceName]
    if (!result) {
      throw new NotFoundException(`Artifact for userId ${userId} not found in ${serviceName}`)
    }
    return result
  }

  async getServiceArtifactById(userId: string, serviceName: ServiceName, id: string): Promise<any> {
    const artifact = await this.userArtifactRepository.findOne({
      where: { userId }
    })
    const result = artifact?.artifacts[serviceName].find(art => art.id === id)
    if (!result) {
      throw new NotFoundException(`Artifact with id ${id} not found in ${serviceName}`)
    }
    return result
  }

  async createServiceArtifact<T>(createArtifactDto: CreateArtifactDto<T>): Promise<UserArtifact> {
    const { serviceName, serviceArtifact } = createArtifactDto

    let artifact = await this.userArtifactRepository.findOne({ where: { userId: this.userId } })

    if (artifact) {
      const artifactArray = artifact.artifacts[serviceName]
      if (this.isArtifactExists(artifactArray, serviceArtifact)) {
        throw new ConflictException(`Artifact for ${serviceName} already exists`)
      }
      artifactArray.push(serviceArtifact)
    } else {
      artifact = this.userArtifactRepository.create(
        this.addOwner(
          {
            userId: this.userId,
            artifacts: {
              ...this.defaultArtifact,
              [serviceName]: [serviceArtifact]
            }
          },
          true
        )
      )
    }
    return this.userArtifactRepository.save(artifact)
  }

  async updateServiceArtifact<T>(
    serviceName: ServiceName,
    updateArtifactDto: UpdateArtifactDto<T>
  ): Promise<UserArtifact> {
    const { userId, id, serviceArtifact } = updateArtifactDto
    const artifact = await this.userArtifactRepository.findOne({ where: { userId } })

    if (artifact && artifact.artifacts[serviceName]) {
      const index = artifact.artifacts[serviceName].findIndex(item => item.id === id)

      if (index === -1) {
        throw new NotFoundException(`Artifact with id ${id} not found in ${serviceName}`)
      }

      artifact.artifacts[serviceName][index] = { ...artifact.artifacts[serviceName][index], ...serviceArtifact }
      const updatedEntity = this.addOwner(artifact)
      return this.userArtifactRepository.save(updatedEntity)
    }

    throw new NotFoundException(`Service ${serviceName} not found for user ${userId}`)
  }

  async getAllServiceArtifacts(serviceName: ServiceName): Promise<any[]> {
    const artifacts = await this.userArtifactRepository.find()
    return artifacts.map(artifact => artifact.artifacts[serviceName]).flat()
  }

  async getAllUserServiceArtifacts(serviceName: ServiceName, userId?: string): Promise<any[]> {
    const userArtifacts = await this.userArtifactRepository.findOne({
      where: { userId: userId || this.userId }
    })

    const sharedArtifactsFromOthers = await this.getAllSharedServiceArtifacts(serviceName, userId || this.userId)

    const userArtifactsList = userArtifacts?.artifacts[serviceName] || []
    return [...userArtifactsList, ...sharedArtifactsFromOthers]
  }

  async deleteServiceArtifact(userId: string, serviceName: ServiceName, id: string): Promise<void> {
    const artifact = await this.userArtifactRepository.findOne({ where: { userId } })

    if (artifact && artifact.artifacts[serviceName]) {
      artifact.artifacts[serviceName] = artifact.artifacts[serviceName].filter(item => item.id !== id)
      await this.userArtifactRepository.save(artifact)
    } else {
      throw new NotFoundException(`Artifact with id ${id} for user ${userId} not found in ${serviceName}`)
    }
  }

  private async getAllSharedServiceArtifacts(serviceName: ServiceName, userId: string): Promise<any[]> {
    const sharedArtifactsFromOthers = await this.userArtifactRepository
      .createQueryBuilder('userArtifact')
      .where('userArtifact.userId != :userId', { userId })
      .andWhere(`userArtifact.artifacts ? :serviceName`, { serviceName })
      .getMany()

    if (!sharedArtifactsFromOthers.length) {
      return []
    }

    const sharedConditionKey = this.sharedConditionMap[serviceName]

    return sharedArtifactsFromOthers
      .flatMap(artifact => artifact.artifacts[serviceName] || [])
      .filter(artifact => artifact[sharedConditionKey] === true)
  }

  private isArtifactExists<T extends { id: string }>(artifactArray: T[], serviceArtifact: T) {
    return artifactArray.some(entity => entity.id === serviceArtifact.id)
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
