import { Injectable } from '@nestjs/common'
import { UserMgmtApi } from './user-mgmt.api'

@Injectable()
export class UserMgmtService {
  constructor(private readonly userMgmtApi: UserMgmtApi) {}

  async getResearcherDatasetIds(userId: string) {
    const userGroups = await this.userMgmtApi.getUserGroups(userId)
    return userGroups.alp_role_study_researcher
  }
}
