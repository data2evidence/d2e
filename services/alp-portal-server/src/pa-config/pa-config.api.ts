import { AxiosRequestConfig } from 'axios'
import { Request } from 'express'
import { Inject, Injectable, Scope } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { REQUEST } from '@nestjs/core'
import { firstValueFrom, map } from 'rxjs'
import { Agent } from 'https'
import { env } from '../env'
import { PaConfig, PaConfigType } from '../types'
import { PA_CONFIG_TYPE } from '../common/const'

interface CdmConfig {
  configId: string
  configName: string
  configs: {
    meta: {
      configId: string
      configName: string
    }
  }[]
}

const CONFIG_TYPE_ACTIONS = {
  [PA_CONFIG_TYPE.BACKEND]: 'getBackendConfig',
  [PA_CONFIG_TYPE.USER]: 'getMyConfig'
}

@Injectable({ scope: Scope.REQUEST })
export class PaConfigApi {
  private readonly jwt: string
  private readonly url: string
  private readonly httpsAgent: Agent

  constructor(@Inject(REQUEST) request: Request, protected readonly httpService: HttpService) {
    this.jwt = request.headers['authorization']
    if (env.PA_CONFIG_API_URL) {
      this.url = env.PA_CONFIG_API_URL
      this.httpsAgent = new Agent({
        rejectUnauthorized: true,
        ca: env.SSL_CA_CERT
      })
    } else {
      throw new Error('No url is set for PaConfigApi')
    }
  }

  async getAllConfigs() {
    const requestConfig = await this.createRequestConfig()
    const body = {
      action: 'getAll'
    }
    const url = `${this.url}/enduser`
    const obs = this.httpService.post(url, body, requestConfig)
    return await firstValueFrom(obs.pipe<CdmConfig[]>(map(result => result.data)))
  }

  async getPaConfig(id: string, type: PaConfigType) {
    const requestConfig = await this.createRequestConfig()
    const body = {
      action: CONFIG_TYPE_ACTIONS[type],
      configId: id
    }
    const url = `${this.url}/enduser`
    const obs = this.httpService.post(url, body, requestConfig)
    return await firstValueFrom(obs.pipe<PaConfig>(map(result => result.data)))
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
