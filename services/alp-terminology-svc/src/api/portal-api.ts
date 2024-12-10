import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Agent } from 'https';
import { env } from '../env';
import { createLogger } from '../logger';

@Injectable()
export class SystemPortalAPI {
  private readonly token: string;
  private readonly url: string;
  private readonly httpsAgent: Agent;
  private readonly logger = createLogger(this.constructor.name);

  constructor(@Inject(REQUEST) request: Request) {
    this.token = request.headers['authorization'];

    if (env.SERVICE_ROUTES.portalServer) {
      this.url = env.SERVICE_ROUTES.portalServer;
      this.httpsAgent = new Agent({
        rejectUnauthorized: true,
        ca: env.TLS__INTERNAL__CA_CRT,
      });
    } else {
      throw new Error('No url is set for PortalAPI');
    }
  }

  private async getDataset(datasetId: string): Promise<{
    databaseCode: string;
    dialect: string;
    vocabSchemaName: string;
  }> {
    this.logger.info(
      `Portal request to get dataset info for id : ${datasetId}`,
    );
    const errorMessage = `Error while getting dataset info for id : ${datasetId}`;
    try {
      const options = await this.createOptions();
      const url = `${this.url}/dataset`;
      options.params = { datasetId: datasetId };
      const result = await axios.get(url, options);
      return result.data;
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getDatasetDetails(datasetId: string) {
    const dataset = await this.getDataset(datasetId);
    if (!dataset) {
      throw new BadRequestException(
        `Could not find dataset with datasetId: ${datasetId}`,
      );
    }

    if (!dataset.databaseCode) {
      throw new InternalServerErrorException(
        `Database code does not exist for datasetId: ${datasetId}`,
      );
    }

    if (!dataset.vocabSchemaName) {
      throw new InternalServerErrorException(
        `vocabSchemaName does not exist for datasetId: ${datasetId}`,
      );
    }

    return {
      databaseCode: dataset.databaseCode,
      vocabSchemaName: dataset.vocabSchemaName,
      dialect: dataset.dialect,
    };
  }

  private async createOptions() {
    let options: AxiosRequestConfig = {};

    options = {
      headers: {
        Authorization: this.token,
      },
      httpsAgent: this.httpsAgent,
      timeout: 20000,
    };
    return options;
  }
}
