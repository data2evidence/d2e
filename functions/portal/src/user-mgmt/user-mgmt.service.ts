import { Injectable } from '@danet/core'
import { UserMgmtApi } from './user-mgmt.api.ts'

@Injectable()
export class UserMgmtService {
  constructor(private readonly userMgmtApi: UserMgmtApi) { }

  async getResearcherDatasetIds(userId: string) {
    const userGroups = await this.userMgmtApi.getUserGroups(userId)
    return userGroups.alp_role_study_researcher
  }
}
