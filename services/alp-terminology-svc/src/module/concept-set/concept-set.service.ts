import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtPayload, decode } from 'jsonwebtoken';
import { createLogger } from '../../logger';
import dataSource from '../../db/data-source';
import { ConceptSet } from '../../entity';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { ConceptService } from '../concept/concept.service';
import { CachedbService } from '../cachedb/cachedb.service';
import { SystemPortalAPI } from 'src/api/portal-api';
import { Brackets } from 'typeorm';
import { env } from 'src/env';

@Injectable()
export class ConceptSetService {
  private readonly userId: string;
  private readonly logger = createLogger(this.constructor.name);
  private token: string;
  private request: Request;

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly conceptService: ConceptService,
    private readonly cachedbService: CachedbService,
  ) {
    const decodedToken = decode(
      request.headers['authorization'].replace(/bearer /i, ''),
    ) as JwtPayload;
    this.userId = decodedToken.sub;
    this.token = request.headers['authorization'];
    this.request = request;
  }

  private addOwner<T>(object: T, isNewEntity = false) {
    if (isNewEntity) {
      return {
        ...object,
        createdBy: this.userId,
        modifiedBy: this.userId,
      };
    }
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

  async getConceptSets() {
    const dataSource = await this.getDataSource();
    const conceptSets = await dataSource
      .getRepository(ConceptSet)
      .createQueryBuilder()
      .where({ createdBy: this.userId })
      .orWhere({ shared: true })
      .orderBy('name')
      .getMany();

    return conceptSets;
  }

  async createConceptSet(conceptSetData: ConceptSet) {
    try {
      const dataSource = await this.getDataSource();
      const newConceptSet = this.addOwner(
        {
          id: randomUUID(),
          ...conceptSetData,
        },
        true,
      );
      const conceptSet = await dataSource
        .createQueryBuilder()
        .insert()
        .into(ConceptSet)
        .values(newConceptSet)
        .execute();

      return conceptSet.identifiers[0].id;
    } catch (err) {
      this.logger.warn(`Creating new concept set has failed: ${err}`);
      throw err;
    }
  }

  async getConceptSet(conceptSetId: string, datasetId: string) {
    const dataSource = await this.getDataSource();
    const conceptSet = await dataSource
      .getRepository(ConceptSet)
      .createQueryBuilder('conceptSet')
      .where('conceptSet.id = :id', { id: conceptSetId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('conceptSet.createdBy = :createdBy', {
            createdBy: this.userId,
          }).orWhere('conceptSet.shared = :shared', { shared: true });
        }),
      )
      .getOne();

    const conceptIds = conceptSet.concepts.map((c) => c.id);

    const systemPortalApi = new SystemPortalAPI(this.token);
    const { vocabSchemaName } = await systemPortalApi.getDatasetDetails(
      datasetId,
    );
    const concepts = await this.cachedbService.getConceptsByIds(
      conceptIds,
      datasetId,
      vocabSchemaName,
    );

    const conceptSetWithConceptDetails = {
      ...conceptSet,
      concepts: concepts.map((concept) => {
        const conceptFromSet = conceptSet.concepts.find(
          (c) => c.id === concept.conceptId,
        );
        return {
          ...concept,
          ...conceptFromSet,
          conceptCode: concept.code,
          conceptName: concept.display,
          vocabularyId: concept.system,
        };
      }),
    };

    return conceptSetWithConceptDetails;
  }

  async updateConceptSet(
    conceptSetId: string,
    conceptSetData: Partial<ConceptSet>,
  ) {
    const dataSource = await this.getDataSource();
    await dataSource
      .createQueryBuilder()
      .update(ConceptSet)
      .set(conceptSetData)
      .where({ id: conceptSetId })
      .andWhere({ createdBy: this.userId })
      .execute();
    return conceptSetId;
  }

  async removeConceptSet(conceptSetId: string) {
    const dataSource = await this.getDataSource();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ConceptSet)
      .where({ id: conceptSetId })
      .andWhere({ createdBy: this.userId })
      .execute();
    return conceptSetId;
  }

  async getIncludedConcepts(body: {
    conceptSetIds: string[];
    datasetId: string;
  }) {
    try {
      const { conceptSetIds, datasetId } = body;

      const systemPortalApi = new SystemPortalAPI(this.token);
      const { vocabSchemaName } = await systemPortalApi.getDatasetDetails(
        datasetId,
      );

      const promises = conceptSetIds.map((conceptSetId) =>
        this.getConceptSet(conceptSetId, datasetId),
      );
      const conceptSets = await Promise.all(promises);

      const conceptIds: number[] = [];
      const conceptIdsToIncludeDescendant: number[] = [];
      const conceptIdsToIncludeMapped: number[] = [];
      const conceptIdsToIncludeMappedAndDescendant: number[] = [];

      conceptSets.forEach((conceptSet) => {
        conceptSet.concepts.forEach((concept) => {
          conceptIds.push(concept.id);
          if (concept.useDescendants) {
            conceptIdsToIncludeDescendant.push(concept.id);
          }
          if (concept.useMapped) {
            conceptIdsToIncludeMapped.push(concept.id);
            if (concept.useDescendants) {
              conceptIdsToIncludeMappedAndDescendant.push(concept.id);
            }
          }
        });
      });

      if (conceptIds.length === 0) {
        return [];
      }

      const includedConceptIds =
        await this.cachedbService.getConceptsAndDescendantIds(
          conceptIds,
          conceptIdsToIncludeDescendant,
          datasetId,
          vocabSchemaName,
        );
      const mappedConceptsAndDescendantIds =
        await this.cachedbService.getConceptsAndDescendantIds(
          conceptIdsToIncludeMapped,
          conceptIdsToIncludeMappedAndDescendant,
          datasetId,
          vocabSchemaName,
        );

      const mappedConceptIds =
        await this.cachedbService.getConceptRelationshipMapsTo(
          mappedConceptsAndDescendantIds,
          datasetId,
          vocabSchemaName,
        );

      mappedConceptIds.forEach((concept) => {
        includedConceptIds.push(concept.concept_id_1);
      });

      const uniqueConceptIds = Array.from(new Set(includedConceptIds)).sort();
      return uniqueConceptIds;
    } catch (err) {
      this.logger.error('Error getting included concepts for concept sets!');
      this.logger.error(err);
      throw err;
    }
  }
}
