import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtPayload, decode } from 'jsonwebtoken';
import { createLogger } from '../../logger';
import { ConceptSet } from '../../entity';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { CachedbService } from '../cachedb/cachedb.service';
import { SystemPortalAPI } from 'src/api/portal-api';

@Injectable()
export class ConceptSetService {
  private readonly userId: string;
  private readonly logger = createLogger(this.constructor.name);

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly cachedbService: CachedbService,
    private readonly systemPortalApi: SystemPortalAPI,
  ) {
    const decodedToken = decode(
      request.headers['authorization'].replace(/bearer /i, ''),
    ) as JwtPayload;
    this.userId = decodedToken.sub;
  }

  private addOwner<T>(object: T, isNewEntity = false) {
    const currentDate = new Date().toISOString();

    if (isNewEntity) {
      return {
        ...object,
        createdBy: this.userId,
        modifiedBy: this.userId,
        createdDate: currentDate,
        modifiedDate: currentDate,
      };
    }

    return {
      ...object,
      modifiedBy: this.userId,
      modifiedDate: currentDate,
    };
  }

  async getConceptSets() {
    try {
      return await this.systemPortalApi.getUserConceptSets(this.userId);
    } catch (error) {
      this.logger.warn(`Error while getting concept sets: ${error}`);
      throw error;
    }
  }

  async createConceptSet(conceptSetData: ConceptSet) {
    try {
      const newConceptSet = this.addOwner(
        {
          id: randomUUID(),
          ...conceptSetData,
        },
        true,
      );

      await this.systemPortalApi.createConceptSet({
        serviceArtifact: newConceptSet,
      });

      return newConceptSet.id;
    } catch (err) {
      this.logger.warn(`Creating new concept set has failed: ${err}`);
      throw err;
    }
  }

  async getConceptSet(conceptSetId: string, datasetId: string) {
    const conceptSet = await this.systemPortalApi.getConceptSetById(
      conceptSetId,
    );

    const conceptIds = conceptSet.concepts.map((c) => c.id);

    const concepts = await this.cachedbService.getConceptsByIds(
      conceptIds,
      datasetId,
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
    try {
      const updatedConceptSet = this.addOwner(
        {
          id: conceptSetId,
          ...conceptSetData,
        },
        false,
      );
      await this.systemPortalApi.updateConceptSet(updatedConceptSet);
      return conceptSetId;
    } catch (error) {
      this.logger.warn(
        `Error while updating concept set with id ${conceptSetId}: ${error}`,
      );
      throw error;
    }
  }

  async removeConceptSet(conceptSetId: string) {
    try {
      await this.systemPortalApi.deleteConceptSet(conceptSetId);
      return conceptSetId;
    } catch (error) {
      this.logger.warn(
        `Error while removing concept set with id ${conceptSetId}: ${error}`,
      );
      throw error;
    }
  }

  async getIncludedConcepts(body: {
    conceptSetIds: string[];
    datasetId: string;
  }) {
    try {
      const { conceptSetIds, datasetId } = body;

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
        );
      const mappedConceptsAndDescendantIds =
        await this.cachedbService.getConceptsAndDescendantIds(
          conceptIdsToIncludeMapped,
          conceptIdsToIncludeMappedAndDescendant,
          datasetId,
        );

      const mappedConceptIds =
        await this.cachedbService.getConceptRelationshipMapsTo(
          mappedConceptsAndDescendantIds,
          datasetId,
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
