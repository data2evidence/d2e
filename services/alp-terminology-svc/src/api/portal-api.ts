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

import { ConceptSet } from 'src/entity';

interface CreateConceptSetDto {
  serviceArtifact: any;
}
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

  async getUserConceptSets(userId: string): Promise<any> {
    this.logger.info('Portal request to get concept sets');
    const errorMessage = 'Error while getting concept sets';
    try {
      const options = await this.createOptions();
      const url = `${this.url}/user-artifact/${userId}/concept_sets/shared/list`;
      const result = await axios.get(url, options);
      return result.data;
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getConceptSetById(id: string): Promise<ConceptSet> {
    this.logger.info(`Portal request to get concept set for id ${id}`);
    const errorMessage = `Error while getting concept set for id ${id}`;
    try {
      const options = await this.createOptions();
      const url = `${this.url}/user-artifact/concept_sets/${id}`;
      const result = await axios.get(url, options);
      return result.data[0];
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async createConceptSet(input: CreateConceptSetDto): Promise<any> {
    this.logger.info('Portal request to create concept set');
    const errorMessage = 'Error while creating concept set';
    try {
      const options = await this.createOptions();
      const url = `${this.url}/user-artifact/concept_sets`;
      const result = await axios.post(url, input, options);
      return result.data;
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async updateConceptSet(input: Record<string, any>): Promise<any> {
    this.logger.info(
      `Portal request to update concept set for id: ${input.id}`,
    );
    const errorMessage = `Error while updating concept set for id: ${input.id}`;
    try {
      const options = await this.createOptions();
      const url = `${this.url}/user-artifact/concept_sets`;
      const result = await axios.put(url, input, options);
      return result.data;
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async deleteConceptSet(id: string): Promise<any> {
    this.logger.info(`Portal request to delete concept set for id: ${id}`);
    const errorMessage = `Error while deleting concept set for id: ${id}`;
    try {
      const options = await this.createOptions();
      const url = `${this.url}/user-artifact/concept_sets/${id}`;
      const result = await axios.delete(url, options);
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
        Authorization: this.token,
      },
      httpsAgent: this.httpsAgent,
      timeout: 20000,
    };
    return options;
  }
}
