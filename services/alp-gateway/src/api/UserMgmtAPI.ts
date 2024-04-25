import { AxiosRequestConfig } from 'axios'
import { post } from './request-util'
import { env, services } from '../env'

export class UserMgmtAPI {
  private readonly baseURL: string
  private readonly endpoint: string = '/usermgmt/api/'

  constructor() {
    if (services.usermgmt) {
      this.baseURL = services.usermgmt + this.endpoint
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
