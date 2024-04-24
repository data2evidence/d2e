import axios, { AxiosRequestConfig } from 'axios';
import { InternalServerErrorException } from '@nestjs/common';
import { Agent } from 'https';
import { env } from '../env';
import { createLogger } from '../logger';

export class SystemPortalAPI {
  private readonly jwt: string;
  private readonly url: string;
  private readonly httpsAgent: Agent;
  private readonly logger = createLogger(this.constructor.name);

  constructor(jwt: string) {
    this.jwt = jwt;
    if (!jwt) {
      throw new Error('No token passed for Portal API!');
    }
    if (env.SYSTEM_PORTAL__API_URL) {
      this.url = env.SYSTEM_PORTAL__API_URL;
      this.httpsAgent = new Agent({
        rejectUnauthorized: true,
        ca: env.TLS__INTERNAL__CA_CRT,
      });
    } else {
      throw new Error('No url is set for PortalAPI');
    }
  }

  async getDataset(
    datasetId: string,
  ): Promise<{ vocabSchemaName: string; databaseCode: string }> {
    this.logger.info(
      `Portal request to get dataset info for id : ${datasetId}`,
    );
    const errorMessage = `Error while getting dataset info for id : ${datasetId}`;
    try {
      const options = await this.createOptions();
      const url = `${this.url}dataset/${datasetId}`;
      const result = await axios.get(url, options);
      //this.logger.info(JSON.stringify(result));
      return result.data;
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  private async createOptions() {
    let options: AxiosRequestConfig = {};

    options = {
      headers: {
        Authorization: this.jwt,
      },
      httpsAgent: this.httpsAgent,
      timeout: 20000,
    };
    return options;
  }
}
