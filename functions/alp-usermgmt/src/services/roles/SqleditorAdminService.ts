import { ROLES } from '../../const'
import { Service } from 'typedi'
import { UserGroupRepository } from '../../repositories'
import { B2cGroupService } from '../B2cGroupService'
import { UserGroupService } from '../UserGroupService'
import { createLogger } from '../../Logger'
import { UserGroupExt } from 'dtos'
import { B2cGroup } from 'entities'

@Service()
export class SqleditorAdminService {
  private static ROLE = ROLES.ALP_SQLEDITOR_ADMIN

  private readonly logger = createLogger(this.constructor.name)

  constructor(
    private readonly userGroupRepo: UserGroupRepository,
    private readonly groupService: B2cGroupService,
    private readonly userGroupService: UserGroupService
  ) {}

  async getUsers(): Promise<UserGroupExt[]> {
    return await this.userGroupService.getUserGroupExtList({ role: ROLES.ALP_SQLEDITOR_ADMIN })
  }

  async getGroup(): Promise<B2cGroup | undefined> {
    return await this.groupService.getGroupByRole(SqleditorAdminService.ROLE)
  }

  async isGranted(userId: string): Promise<boolean> {
    if (!userId) return false

    const userGroups = await this.userGroupRepo.getList({ user_id: userId })
    if (userGroups.length === 0) return false

    const groupIds = userGroups.map(ug => ug.b2cGroupId)
    const groups = await this.groupService.getGroupsByIds(groupIds)
    return groups.some(g => g.role === SqleditorAdminService.ROLE)
  }

  async registerUser(userId: string, system: string): Promise<void> {
    const group = await this.groupService.getGroupBySystemRole(system, SqleditorAdminService.ROLE)
    if (!group?.id) {
      this.logger.warn(`Unable to find group for role ${SqleditorAdminService.ROLE}`)
      throw new Error(`Unable to find group for role ${SqleditorAdminService.ROLE}`)
    }

    this.logger.info(`Register ${SqleditorAdminService.ROLE} for ${userId}`)
    return await this.userGroupService.registerUserToGroup(userId, group.id)
  }

  async withdrawUser(userId: string, system: string): Promise<void> {
    const group = await this.groupService.getGroupBySystemRole(system, SqleditorAdminService.ROLE)
    if (!group?.id) {
      this.logger.warn(`Unable to find group for role ${SqleditorAdminService.ROLE}`)
      throw new Error(`Unable to find group for role ${SqleditorAdminService.ROLE}`)
    }

    this.logger.info(`Withdraw ${SqleditorAdminService.ROLE} for ${userId}`)
    return await this.userGroupService.withdrawUserFromGroup(userId, group.id)
  }
}
