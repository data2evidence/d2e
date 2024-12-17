import { Injectable, SCOPE } from '@danet/core';
import axios, { AxiosRequestConfig } from "npm:axios";
import { services } from '../env.ts';
import { IDatabaseSchemaFilterResult, IDatasetFilterScopesResult } from '../types.d.ts';
import { RequestContextService } from '../common/request-context.service.ts';
import { Agent } from "node:https";
import { env } from '../env.ts';

const get = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return axios.get<T>(url, config);
};

@Injectable({ scope: SCOPE.REQUEST })
export class AnalyticsApi {
  private readonly url: string
  private readonly requestContextService: RequestContextService
  private readonly jwt: string
  private readonly httpsAgent: Agent

  constructor(requestContextService: RequestContextService) {
    this.requestContextService = requestContextService;
    this.jwt = this.requestContextService.getAuthToken()?.sub;
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
    const url = `${this.url}/api/services/dataset-filter/filter-scopes`;
    const options = this.getRequestConfig(this.jwt);
    const params = new URLSearchParams();
    params.append('datasetsWithSchema', datasetsWithSchema);

    try {
      const result = await get<IDatasetFilterScopesResult>(url, { ...options, params });
      return result.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`HTTP error! status: ${error.response?.status}, message: ${error.message}`);
      }
      throw error;
    }
  }

  async getDatabaseSchemaFilter(datasetsWithSchema: string, filterParams: any, jwt: string): Promise<IDatabaseSchemaFilterResult> {
    const url = `${this.url}/api/services/dataset-filter/database-schema-filter`;
    
    const options = this.getRequestConfig(jwt);
    const params = new URLSearchParams();
    params.append('datasetsWithSchema', datasetsWithSchema);
    params.append('filterParams', JSON.stringify(filterParams));
    const result = await get(url, { ...options, params });
    return result.data;
  }

  private getRequestConfig(jwt: string): AxiosRequestConfig {
    return {
      headers: {
        Authorization: jwt
      },
      httpsAgent: this.httpsAgent,
      timeout: 20000
    };
  }
}
