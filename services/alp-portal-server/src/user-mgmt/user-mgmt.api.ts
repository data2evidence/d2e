import { AxiosRequestConfig } from 'axios'
import { Request } from 'express'
import { Inject, Injectable, Scope } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { REQUEST } from '@nestjs/core'
import { firstValueFrom, map } from 'rxjs'
import { Agent } from 'https'
import { env } from '../env'
import { UserGroup } from '../types'

@Injectable({ scope: Scope.REQUEST })
export class UserMgmtApi {
  private readonly jwt: string
  private readonly url: string
  private readonly httpsAgent: Agent

  constructor(@Inject(REQUEST) request: Request, protected readonly httpService: HttpService) {
    this.jwt = request.headers['authorization']
    if (env.USER_MGMT_API_URL) {
      this.url = env.USER_MGMT_API_URL
      this.httpsAgent = new Agent({
        rejectUnauthorized: true,
        ca: env.SSL_CA_CERT
      })
    } else {
      throw new Error('No url is set for UserMgmtApi')
    }
  }

  async getUserGroups(userId: string) {
    const requestConfig = await this.createRequestConfig()
    const body = { userId }
    const url = `${this.url}/user-group/list`
    console.log('url', url)
    const obs = this.httpService.post(url, body, requestConfig)
    return await firstValueFrom(obs.pipe<UserGroup>(map(result => result.data)))
  }

  private async createRequestConfig(): Promise<AxiosRequestConfig> {
    return {
      headers: {
        Authorization: this.jwt
      },
      httpsAgent: this.httpsAgent
    }
  }
}
