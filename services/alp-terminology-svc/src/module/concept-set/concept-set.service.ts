import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtPayload, decode } from 'jsonwebtoken';
import { createLogger } from '../../logger';
import dataSource from '../../db/data-source';
import { ConceptSet } from '../../entity';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { ConceptService } from '../concept/concept.service';
import { MeilisearchAPI } from '../../api/meilisearch-api';
import { SystemPortalAPI } from 'src/api/portal-api';

@Injectable()
export class ConceptSetService {
  private readonly userId: string;
  private readonly logger = createLogger(this.constructor.name);
  private token: string;
  private request: Request;

  constructor(@Inject(REQUEST) request: Request) {
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
      .createQueryBuilder()
      .where({ id: conceptSetId })
      .getOne();
    const conceptIds = conceptSet.concepts.map((c) => c.id);
    const conceptService = new ConceptService(this.request);
    const concepts = await conceptService.getConceptsByIds(
      datasetId,
      conceptIds,
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
      const { databaseCode, vocabSchemaName } =
        await systemPortalApi.getDatasetDetails(datasetId);

      const meilisearchApi = new MeilisearchAPI();
      const conceptIndex = `${databaseCode}_${vocabSchemaName}_concept`;
      const conceptAncestorIndex = `${databaseCode}_${vocabSchemaName}_concept_ancestor`;
      const conceptRelationshipIndex = `${databaseCode}_${vocabSchemaName}_concept_relationship`;
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

      const includedConceptIds = await this.getConceptsAndDescendantIds(
        meilisearchApi,
        conceptIndex,
        conceptAncestorIndex,
        conceptIds,
        conceptIdsToIncludeDescendant,
      );

      const mappedConceptsAndDescendantIds =
        await this.getConceptsAndDescendantIds(
          meilisearchApi,
          conceptIndex,
          conceptAncestorIndex,
          conceptIdsToIncludeMapped,
          conceptIdsToIncludeMappedAndDescendant,
        );

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
