import { Client } from '@bartlomieju/postgres';
import pg from 'npm:pg';
import { Injectable } from '@danet/core';
import { OnAppBootstrap, OnAppClose } from 'jsr:@danet/core/hook';
import { DataSource } from 'npm:typeorm';
import { Config } from '../config/entity/config.entity.ts';
import { DatasetAttributeConfig } from '../dataset/entity/dataset-attribute-config.entity.ts';
import { DatasetAttribute } from '../dataset/entity/dataset-attribute.entity.ts';
import { DatasetDashboard } from '../dataset/entity/dataset-dashboard.entity.ts';
import { DatasetDetail } from '../dataset/entity/dataset-detail.entity.ts';
import { DatasetRelease } from '../dataset/entity/dataset-release.entity.ts';
import { DatasetTagConfig } from '../dataset/entity/dataset-tag-config.entity.ts';
import { DatasetTag } from '../dataset/entity/dataset-tag.entity.ts';
import { Dataset } from '../dataset/entity/dataset.entity.ts';
import { Feature } from '../feature/entity/feature.entity.ts';
import { Notebook } from '../notebook/entity/notebook.entity.ts';
import { UserArtifactGroup } from '../user-artifact/entity/user-artifact-group.entity.ts';
import { UserArtifact } from '../user-artifact/entity/user-artifact.entity.ts';
import { env } from '../env.ts';
@Injectable()
export class PostgresService implements OnAppBootstrap, OnAppClose {
  private _env = Deno.env.toObject();
  public client: Client;
  private dataSource: DataSource;

  constructor() {
    console.log(env);
    console.log(`_env: ${JSON.stringify(this._env)}`);
    this.client = new Client({
      user: 'postgres',
      password: 'Toor1234',
      database: this._env['PG__DB_NAME'] || 'alp',
      hostname: this._env['PG__HOST'] || 'localhost',
      schema: 'portal',
    });

    this.dataSource = new DataSource({
      type: 'postgres',
      host: this._env['PG__HOST'] || 'localhost',
      port: parseInt(this._env['DB_PORT']) || 5432,
      username: 'postgres',
      password: 'Toor1234',
      database: this._env['PG__DB_NAME'] || 'alp',
      schema: 'portal',
      // TODO: Change to wildcard matching
      entities: [Feature, Config, UserArtifact, UserArtifactGroup, Dataset, DatasetDetail, DatasetTag, DatasetTagConfig, DatasetDashboard, DatasetRelease, DatasetAttribute, DatasetAttributeConfig, Notebook],
    });
  }

  getDataSource() {
    if (!this.dataSource.isInitialized) {
      this.dataSource.initialize();
    }
    return this.dataSource;
  }

  async getDataSourceAsync() {
    console.log('Getting DataSource:', {
      isInitialized: this.dataSource.isInitialized,
      hasMetadata: this.dataSource.entityMetadatas.length
    });

    if (!this.dataSource.isInitialized) {
      console.log('Re-initializing DataSource...');
      await this.dataSource.initialize();
    }

    // Verify metadata is loaded
    if (this.dataSource.entityMetadatas.length === 0) {
      console.error('No entity metadata loaded after initialization!');
      // Force reload entities
      await this.dataSource.synchronize();
    }

    return this.dataSource;
  }

  async onAppBootstrap() {
    if (!this.client.connected) {
      await this.client.connect();
    }

    // Initialize TypeORM and create tables
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      console.log('TypeORM DataSource initialized');

      await this.client.queryObject(
        `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
      );
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  async onAppClose() {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
    }

    if (this.client?.connected) {
      await this.client.end();
    }
  }
}
