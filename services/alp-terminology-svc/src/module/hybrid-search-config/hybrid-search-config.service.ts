import { REQUEST } from '@nestjs/core';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload, decode } from 'jsonwebtoken';
import dataSource from '../../db/data-source';
import { createLogger } from '../../logger';
import { HybridSearchConfig } from '../../entity';
import { HybridSearchConfigDto } from './dto/hybrid-search-config.dto';

@Injectable({ scope: Scope.REQUEST })
export class HybridSearchConfigService {
  private readonly logger = createLogger(this.constructor.name);
  private readonly userId: string;

  constructor(@Inject(REQUEST) request?: Request) {
    if (request) {
      const decodedToken = decode(
        request.headers['authorization'].replace(/bearer /i, ''),
      ) as JwtPayload;
      this.userId = decodedToken.sub;
    }
  }

  private addModifier<T>(object: T) {
    return {
      ...object,
      modifiedBy: this.userId,
    };
  }

  async getDataSource() {
    if (!dataSource.isInitialized) {
      try {
        await dataSource.initialize();
      } catch (e) {
        this.logger.error(`Datasource initialisation has failed: ${e}`);
        throw e;
      }
    }
    return dataSource;
  }

  async getHybridSearchConfig() {
    const dataSource = await this.getDataSource();
    const hybridSearchConfig = await dataSource
      .getRepository(HybridSearchConfig)
      .createQueryBuilder()
      .getOne();
    return hybridSearchConfig;
  }

  async setHybridSearchConfig(hybridSearchConfigData: HybridSearchConfigDto) {
    const dataSource = await this.getDataSource();
    await dataSource
      .createQueryBuilder()
      .update(HybridSearchConfig)
      .set(this.addModifier(hybridSearchConfigData))
      .where({ id: hybridSearchConfigData.id })
      .execute();
    return hybridSearchConfigData.id;
  }
}
