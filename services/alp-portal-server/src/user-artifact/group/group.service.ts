import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserArtifactGroup } from '../entity'
import { REQUEST } from '@nestjs/core'
import { decode, JwtPayload } from 'jsonwebtoken'

@Injectable()
export class GroupService {
  private readonly userId: string

  constructor(
    @Inject(REQUEST) request: Request,
    @InjectRepository(UserArtifactGroup)
    private readonly groupRepository: Repository<UserArtifactGroup>
  ) {
    const token = decode(request.headers['authorization'].replace(/bearer /i, '')) as JwtPayload
    this.userId = token.sub
  }

  async addUserToGroup(userId: string): Promise<UserArtifactGroup> {
    const group = this.groupRepository.create(this.addOwner({ userId }, true))
    return this.groupRepository.save(group)
  }

  async removeUserFromGroup(userId: string): Promise<void> {
    await this.groupRepository.delete({ userId })
  }

  async userExists(userId: string): Promise<boolean> {
    const user = await this.groupRepository.findOne({ where: { userId } })
    return !!user
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
