import { AxiosRequestConfig } from 'axios'
import { post } from './request-util'
import { env } from '../env'

export class UserMgmtAPI {
  private readonly baseURL: string

  constructor() {
    if (env.USER_MGMT_BASE_URL) {
      this.baseURL = env.USER_MGMT_BASE_URL
    } else {
      throw new Error('No url is set for UserMgmtAPI')
    }
  }

  async getUserGroups(token: string, userId: string) {
    const options: AxiosRequestConfig = {
      headers: {
        Authorization: token
      }
    }
    const url = `${this.baseURL}user-group/list`
    const result = await post(url, { userId }, options)
    return result.data
  }
}
