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
    [ServiceName.BOOKMARKS]: [],
    [ServiceName.CONCEPT_SETS]: []
  }

  private sharedConditionMap = {
    [ServiceName.NOTEBOOKS]: 'isShared'
  }

  async getUserServiceArtifact(userId: string, serviceName: ServiceName): Promise<any> {
    const artifact = await this.userArtifactRepository.findOne({
      where: { userId }
    })
    if (!artifact?.artifacts?.[serviceName]) {
      throw new NotFoundException(`Artifacts for userId ${userId} not found in ${serviceName}`)
    }
    const result = artifact?.artifacts[serviceName]
    if (!result) {
      throw new NotFoundException(`Artifact for userId ${userId} not found in ${serviceName}`)
    }
    return result
  }

  async getUserServiceArtifactById(userId: string, serviceName: ServiceName, id: string): Promise<any> {
    const artifact = await this.userArtifactRepository.findOne({
      where: { userId }
    })
    if (!artifact?.artifacts?.[serviceName]) {
      throw new NotFoundException(`Artifacts for userId ${userId} not found in ${serviceName}`)
    }
    const result = artifact?.artifacts[serviceName].find(art => art.id === id)
    if (!result) {
      throw new NotFoundException(`Artifact with id ${id} not found in ${serviceName}`)
    }
    return result
  }

  async getServiceArtifactById(serviceName: string, id: string): Promise<UserArtifact[]> {
    const userArtifacts = await this.userArtifactRepository
      .createQueryBuilder('user_artifact')
      .where(`user_artifact.artifacts->:serviceName @> :jsonValue`, {
        serviceName,
        jsonValue: JSON.stringify([{ id }])
      })
      .getMany()

    for (const artifact of userArtifacts) {
      const matchedEntity = artifact.artifacts[serviceName].find(item => item.id === id)
      if (matchedEntity) {
        return [matchedEntity]
      }
    }

    throw new NotFoundException(`Artifact with id ${id} not found in ${serviceName}`)
  }

  async createServiceArtifact<T extends { id: string }>(
    serviceName: string,
    createArtifactDto: CreateArtifactDto<T>
  ): Promise<UserArtifact> {
    const { serviceArtifact } = createArtifactDto

    let artifact = await this.userArtifactRepository.findOne({ where: { userId: this.userId } })

    if (artifact) {
      const artifactArray = artifact.artifacts[serviceName]
      if (artifactArray) {
        if (this.isArtifactExists(artifactArray, serviceArtifact)) {
          throw new ConflictException(`Artifact for ${serviceName} already exists`)
        }
        artifactArray.push(serviceArtifact)
      } else {
        artifact.artifacts[serviceName] = [serviceArtifact]
      }
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

    try {
      return await this.userArtifactRepository.save(artifact)
    } catch (error) {
      throw new ConflictException('Error creating service artifact', error.message)
    }
  }

  async updateUserServiceArtifact<T>(
    serviceName: ServiceName,
    updateArtifactDto: UpdateArtifactDto<T>
  ): Promise<UserArtifact> {
    const { userId, id, serviceArtifact } = updateArtifactDto

    if (!updateArtifactDto.serviceArtifact) {
      throw new ConflictException('UpdateArtifactDto is missing serviceArtifact')
    }
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

  async updateServiceArtifactEntity(serviceName: string, updatedEntity: Record<string, any>): Promise<UserArtifact> {
    const userArtifacts = await this.userArtifactRepository.find()

    if (!userArtifacts || userArtifacts.length === 0) {
      throw new NotFoundException('No user artifacts found')
    }

    for (const userArtifact of userArtifacts) {
      const artifacts = userArtifact.artifacts[serviceName]

      if (artifacts) {
        const artifactIndex = artifacts.findIndex(artifact => artifact.id === updatedEntity.id)

        if (artifactIndex !== -1) {
          const artifact = artifacts[artifactIndex]

          Object.assign(artifact, updatedEntity)
          userArtifact.artifacts[serviceName] = [...artifacts]

          await this.userArtifactRepository.save(userArtifact)

          return userArtifact
        }
      }
    }

    throw new NotFoundException('Service artifact not found')
  }

  async getAllServiceArtifacts(serviceName: ServiceName): Promise<any[]> {
    const result = await this.userArtifactRepository
      .createQueryBuilder('user_artifact')
      .select(`jsonb_array_elements(user_artifact.artifacts->:serviceName)`, 'artifact')
      .where(`user_artifact.artifacts ? :serviceName`, { serviceName })
      .getRawMany()

    return result.map(row => row.artifact)
  }

  async getAllUserServiceArtifacts(serviceName: ServiceName, userId?: string): Promise<any[]> {
    const userArtifacts = await this.userArtifactRepository.findOne({
      where: { userId: userId || this.userId }
    })

    const sharedArtifactsFromOthers = await this.getAllSharedServiceArtifacts(serviceName, userId || this.userId)

    const userArtifactsList = userArtifacts?.artifacts[serviceName] || []
    return [...userArtifactsList, ...sharedArtifactsFromOthers]
  }

  async deleteUserServiceArtifact(userId: string, serviceName: ServiceName, id: string): Promise<void> {
    const artifact = await this.userArtifactRepository.findOne({ where: { userId } })

    if (artifact && artifact.artifacts[serviceName]) {
      artifact.artifacts[serviceName] = artifact.artifacts[serviceName].filter(item => item.id !== id)
      await this.userArtifactRepository.save(artifact)
    } else {
      throw new NotFoundException(`Artifact with id ${id} for user ${userId} not found in ${serviceName}`)
    }
  }

  async deleteServiceArtifactEntity(serviceName: string, entityId: string): Promise<UserArtifact> {
    const userArtifacts = await this.userArtifactRepository.find()

    if (!userArtifacts || userArtifacts.length === 0) {
      throw new NotFoundException('No user artifacts found')
    }

    for (const userArtifact of userArtifacts) {
      const artifacts = userArtifact.artifacts[serviceName]

      if (artifacts) {
        const artifactIndex = artifacts.findIndex(artifact => artifact.id === entityId)

        if (artifactIndex !== -1) {
          artifacts.splice(artifactIndex, 1)
          userArtifact.artifacts[serviceName] = [...artifacts]
          await this.userArtifactRepository.save(userArtifact)

          return userArtifact
        }
      }
    }

    throw new NotFoundException('Service artifact not found')
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
