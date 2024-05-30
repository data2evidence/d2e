import { AxiosRequestConfig } from 'axios'
import { Inject, Injectable, Scope } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { firstValueFrom, map } from 'rxjs'
import { Agent } from 'https'
import { env, services } from '../env'
import { IDatasetFilterScopesResult, IDatabaseSchemaFilterResult } from '../types'

@Injectable({ scope: Scope.REQUEST })
export class AnalyticsApi {
  private readonly jwt: string
  private readonly url: string
  private readonly httpsAgent: Agent

  constructor(@Inject(REQUEST) request: Request, private readonly httpService: HttpService) {
    this.jwt = request.headers['authorization']
    if (services.analytics) {
      this.url = services.analytics
      this.httpsAgent = new Agent({
        rejectUnauthorized: true,
        ca: env.SSL_CA_CERT
      })
    } else {
      throw new Error('No url is set for AnalyticsApi')
    }
  }

  async getFilterScopes(datasetsWithSchema: string): Promise<IDatasetFilterScopesResult> {
    const requestConfig = await this.createRequestConfig()
    const url = `${this.url}/api/services/dataset-filter/filter-scopes`
    const obs = this.httpService.get(url, {
      ...requestConfig,
      params: { datasetsWithSchema }
    })
    return await firstValueFrom(obs.pipe(map(result => result.data)))
  }

  async getDatabaseSchemaFilter(datasetsWithSchema: string, filterParams): Promise<IDatabaseSchemaFilterResult> {
    const requestConfig = await this.createRequestConfig()
    const url = `${this.url}/api/services/dataset-filter/database-schema-filter`
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
