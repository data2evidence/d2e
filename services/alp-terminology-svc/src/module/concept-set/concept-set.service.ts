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
import { MeilisearchAPI } from '../../api/meilisearch-api';
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

    let concepts;
    // If USE_DUCKDB_FTS, use duckdb fts instead of meilisearch
    if (env.USE_DUCKDB_FTS) {
      this.logger.info('Searching with Duckdb FTS');
      const systemPortalApi = new SystemPortalAPI(this.token);
      const { vocabSchemaName } = await systemPortalApi.getDatasetDetails(
        datasetId,
      );
      concepts = await this.cachedbService.getConceptsByIds(
        conceptIds,
        datasetId,
        vocabSchemaName,
      );
    } else {
      this.logger.info('Searching with Meilisearch');
      concepts = await this.conceptService.getConceptsByIds(
        datasetId,
        conceptIds,
      );
    }

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
      const { databaseCode, vocabSchemaName, dialect } =
        await systemPortalApi.getDatasetDetails(datasetId);

      const meilisearchApi = new MeilisearchAPI();
      const conceptName = dialect === 'hana' ? 'CONCEPT' : 'concept';
      const conceptAncestorName =
        dialect === 'hana' ? 'CONCEPT_ANCESTOR' : 'concept_ancestor';
      const conceptRelationshipName =
        dialect === 'hana' ? 'CONCEPT_RELATIONSHIP' : 'concept_relationship';

      const conceptIndex = `${databaseCode}_${vocabSchemaName}_${conceptName}`;
      const conceptAncestorIndex = `${databaseCode}_${vocabSchemaName}_${conceptAncestorName}`;
      const conceptRelationshipIndex = `${databaseCode}_${vocabSchemaName}_${conceptRelationshipName}`;

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

      let includedConceptIds;
      let mappedConceptsAndDescendantIds;
      // If USE_DUCKDB_FTS, use duckdb fts instead of meilisearch
      if (env.USE_DUCKDB_FTS) {
        includedConceptIds =
          await this.cachedbService.getConceptsAndDescendantIds(
            conceptIds,
            conceptIdsToIncludeDescendant,
            datasetId,
            vocabSchemaName,
          );
        mappedConceptsAndDescendantIds =
          await this.cachedbService.getConceptsAndDescendantIds(
            conceptIdsToIncludeMapped,
            conceptIdsToIncludeMappedAndDescendant,
            datasetId,
            vocabSchemaName,
          );
      } else {
        includedConceptIds = await this.getConceptsAndDescendantIds(
          meilisearchApi,
          conceptIndex,
          conceptAncestorIndex,
          conceptIds,
          conceptIdsToIncludeDescendant,
        );
        mappedConceptsAndDescendantIds = await this.getConceptsAndDescendantIds(
          meilisearchApi,
          conceptIndex,
          conceptAncestorIndex,
          conceptIdsToIncludeMapped,
          conceptIdsToIncludeMappedAndDescendant,
        );
      }
      const mappedConceptIds = await meilisearchApi.getMapped(
        mappedConceptsAndDescendantIds,
        conceptRelationshipIndex,
      );

      mappedConceptIds.forEach((concept) => {
        concept.hits.forEach((hit) => {
          includedConceptIds.push(hit.concept_id_1);
        });
      });

      const uniqueConceptIds = Array.from(new Set(includedConceptIds)).sort();
      return uniqueConceptIds;
    } catch (err) {
      this.logger.error('Error getting included concepts for concept sets!');
      this.logger.error(err);
      throw err;
    }
  }

  private async getConceptsAndDescendantIds(
    meilisearchApi: MeilisearchAPI,
    conceptIndex: string,
    conceptAncestorIndex: string,
    conceptIds: number[],
    descendantIds: number[],
  ) {
    if (!conceptIds.length) {
      return [];
    }
    const conceptsAndDescendantIds: number[] = [];

    // Ensures included concept IDs are present in vocab schema and valid
    const validConcepts = await meilisearchApi.getMultipleExactConcepts(
      conceptIds,
      conceptIndex,
      false,
    );
    validConcepts.forEach((concept) => {
      concept.hits.forEach((hit) => {
        conceptsAndDescendantIds.push(hit.concept_id);
      });
    });

    if (!descendantIds.length) {
      return conceptsAndDescendantIds;
    }

    const conceptDescendants = await meilisearchApi.getDescendants(
      descendantIds,
      conceptAncestorIndex,
    );
    conceptDescendants.forEach((concept) => {
      concept.hits.forEach((hit) => {
        conceptsAndDescendantIds.push(hit.descendant_concept_id);
      });
    });
    return conceptsAndDescendantIds;
  }
}
