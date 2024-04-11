import { AxiosRequestConfig } from 'axios'
import { Inject, Injectable, Scope } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { firstValueFrom, map } from 'rxjs'
import { Agent } from 'https'
import { env } from '../env'
import { IDatasetFilterScopesResult, IDatabaseSchemaFilterResult } from '../types'

@Injectable({ scope: Scope.REQUEST })
export class AnalyticsApi {
  private readonly jwt: string
  private readonly url: string
  private readonly httpsAgent: Agent

  constructor(@Inject(REQUEST) request: Request, private readonly httpService: HttpService) {
    this.jwt = request.headers['authorization']
    if (env.ANALYTICS_SVC_API_BASE_URL) {
      this.url = env.ANALYTICS_SVC_API_BASE_URL
      this.httpsAgent = new Agent({
        rejectUnauthorized: this.isAuthorized(),
        ca: this.isAuthorized() ? env.PORTAL_SERVER_CA_CERT : undefined
      })
    } else {
      throw new Error('No url is set for AnalyticsApi')
    }
  }

  isAuthorized(): boolean {
    return this.url.startsWith('https://localhost:') || this.url.startsWith('https://alp-minerva-gateway-')
      ? false
      : true
  }

  async getFilterScopes(datasetsWithSchema: string): Promise<IDatasetFilterScopesResult> {
    const requestConfig = await this.createRequestConfig()
    const url = `${this.url}api/services/dataset-filter/filter-scopes`
    const obs = this.httpService.get(url, {
      ...requestConfig,
      params: { datasetsWithSchema }
    })
    return await firstValueFrom(obs.pipe(map(result => result.data)))
  }

  async getDatabaseSchemaFilter(datasetsWithSchema: string, filterParams): Promise<IDatabaseSchemaFilterResult> {
    const requestConfig = await this.createRequestConfig()
    const url = `${this.url}api/services/dataset-filter/database-schema-filter`
    const obs = this.httpService.get(url, {
      ...requestConfig,
      params: {
        datasetsWithSchema,
        filterParams
      }
    })
    return await firstValueFrom(obs.pipe(map(result => result.data)))
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
