import { Injectable, SCOPE } from '@danet/core';
import { Agent } from 'node:https';
import axios, { AxiosRequestConfig } from "npm:axios";
import { PA_CONFIG_TYPE } from '../common/const.ts';
import { RequestContextService } from '../common/request-context.service.ts';
import { env, services } from '../env.ts';
import { PaConfig, PaConfigType } from '../types.d.ts';

interface CdmConfig {
  configId: string;
  configName: string;
  configs: {
    meta: {
      configId: string;
      configName: string;
    }
  }[];
}

const CONFIG_TYPE_ACTIONS = {
  [PA_CONFIG_TYPE.BACKEND]: 'getBackendConfig',
  [PA_CONFIG_TYPE.USER]: 'getMyConfig'
};

const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return axios.post<T>(url, data, config);
};

@Injectable({ scope: SCOPE.REQUEST })
export class PaConfigApi {
  private readonly jwt: string;
  private readonly url: string;
  private readonly httpsAgent: Agent;

  constructor(private readonly requestContextService: RequestContextService) {
    if (services.paConfig) {
      this.jwt = this.requestContextService.getAuthToken();
      this.url = services.paConfig;
      this.httpsAgent = new Agent({
        rejectUnauthorized: true,
        ca: env.SSL_CA_CERT
      });
    } else {
      throw new Error('No url is set for PaConfigApi');
    }
  }

  async getAllConfigs(): Promise<CdmConfig[]> {
    const requestConfig = this.getRequestConfig();
    const body = {
      action: 'getAll'
    };
    const url = `${this.url}/enduser`;
    const result = await post<CdmConfig[]>(url, body, requestConfig);
    return result.data;
  }

  async getPaConfig(id: string, type: PaConfigType): Promise<PaConfig> {
    const requestConfig = this.getRequestConfig();
    const body = {
      action: CONFIG_TYPE_ACTIONS[type],
      configId: id
    };
    const url = `${this.url}/enduser`;
    const result = await post<PaConfig>(url, body, requestConfig);
    return result.data;
  }

  private getRequestConfig(): AxiosRequestConfig {
    return {
      headers: {
        Authorization: this.jwt
      },
      httpsAgent: this.httpsAgent
    };
  }
}