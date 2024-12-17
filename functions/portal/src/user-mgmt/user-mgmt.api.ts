import { Injectable, SCOPE } from '@danet/core';
import { Agent } from 'node:https';
import axios, { AxiosRequestConfig } from "npm:axios";
import { RequestContextService } from '../common/request-context.service.ts';
import { env, services } from '../env.ts';
import { UserGroup } from '../types.d.ts';

const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return axios.post<T>(url, data, config);
};

@Injectable({ scope: SCOPE.REQUEST })
export class UserMgmtApi {
  private readonly jwt: string
  private readonly url: string
  private readonly httpsAgent: Agent

  constructor(private readonly requestContextService: RequestContextService) {
    if (services.usermgmt) {
      this.jwt = this.requestContextService.getAuthToken()
      this.url = services.usermgmt
      this.httpsAgent = new Agent({
        rejectUnauthorized: true,
        ca: env.SSL_CA_CERT
      })
    } else {
      throw new Error('No url is set for UserMgmtApi')
    }
  }

  async getUserGroups(userId: string) {
    const requestConfig = this.getRequestConfig()
    const body = { userId }
    const url = `${this.url}/user-group/list`
    const result = await post<UserGroup>(url, body, requestConfig)
    return result.data
  }

  private getRequestConfig(): AxiosRequestConfig {
    return {
      headers: {
        Authorization: this.jwt
      },
      httpsAgent: this.httpsAgent
    }
  }
}