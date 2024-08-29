import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  IMeilisearchConcept,
  FhirValueSet,
  FhirValueSetExpansion,
  FhirValueSetExpansionContainsWithExt,
  FhirResourceType,
  FhirConceptMapGroup,
  FhirConceptMap,
  FhirConceptMapElementWithExt,
  FhirConceptMapElementTarget,
  IConcept,
  Filters,
  HybridSearchConfig,
  ConceptHierarchyEdge,
  ConceptHierarchyNodeLevel,
  ConceptHierarchyNode,
} from 'src/utils/types';
import { createLogger } from '../logger';
import { groupBy } from 'src/utils/helperUtil';
// TODO move to NESTJS DI
import { CachedbAPI } from 'src/api/cachedb-api';

@Injectable()
export class CachedbService {
  private readonly token: string;
  private readonly logger = createLogger(this.constructor.name);

  constructor(@Inject(REQUEST) request: Request) {
    this.token = request.headers['authorization'];
  }

  async getTerminologyDetailsWithRelationships(
    databaseCode: string,
    vocabSchemaName: string,
    dialect: string,
    conceptId: number,
    datasetId: string,
  ) {
    this.logger.info('Get list of concept details and connections');
    try {
      const searchConcepts1: number[] = [conceptId];
      const vocab_file_name = `${databaseCode}_${vocabSchemaName}`;

      const cachedbApi = new CachedbAPI(this.token, datasetId);
      const meilisearchResultConcept1: any =
        await cachedbApi.getMultipleExactConcepts(
          searchConcepts1,
          vocab_file_name,
          true,
        );

      const conceptC1: FhirValueSet = this.meilisearchResultMapping(
        meilisearchResultConcept1,
      );
      const groups: FhirConceptMapGroup[] = [];

      if (conceptC1.expansion.contains.length > 0) {
        const detailsC1: FhirValueSetExpansionContainsWithExt =
          conceptC1.expansion.contains[0];
        const fhirTargetElements: FhirConceptMapElementTarget[] = [];
        const conceptRelations = await cachedbApi.getConceptRelationships(
          detailsC1.conceptId,
          vocab_file_name,
        );

        for (let i = 0; i < conceptRelations.hits.length; i++) {
          const relationships = await cachedbApi.getRelationships(
            conceptRelations.hits[i].relationship_id,
            vocab_file_name,
          );
          const searchConcepts2: number[] = [
            conceptRelations.hits[i].concept_id_2,
          ];
          const meilisearchResultConcept2: any =
            await cachedbApi.getMultipleExactConcepts(
              searchConcepts2,
              vocab_file_name,
              true,
            );
          const conceptC2: FhirValueSet = this.meilisearchResultMapping(
            meilisearchResultConcept2,
          );
          const detailsC2: FhirValueSetExpansionContainsWithExt =
            conceptC2.expansion.contains[0];
          if (!detailsC2) {
            continue;
          }
          const searchConcepts3: number[] = [
            relationships.hits[0].relationship_concept_id,
          ];
          const meilisearchResultConcept3: any =
            await cachedbApi.getMultipleExactConcepts(
              searchConcepts3,
              vocab_file_name,
              true,
            );
          const conceptC3: FhirValueSet = this.meilisearchResultMapping(
            meilisearchResultConcept3,
          );
          const detailsC3: FhirValueSetExpansionContainsWithExt =
            conceptC3.expansion.contains[0];
          if (!detailsC3) {
            continue;
          }
          const fhirTargetElement: FhirConceptMapElementTarget = {
            code: detailsC2.conceptId,
            display: detailsC2.display,
            equivalence: detailsC3.display,
            vocabularyId: detailsC2.system,
          };
          fhirTargetElements.push(fhirTargetElement);
        }
        const conceptRelationsGroupByVocab = groupBy(
          fhirTargetElements,
          'vocabularyId',
        );
        for (const targetVocab in conceptRelationsGroupByVocab) {
          const conceptMapElement: FhirConceptMapElementWithExt = {
            code: detailsC1.code,
            display: detailsC1.display,
            valueSet: conceptC1,
            target: conceptRelationsGroupByVocab[targetVocab],
          };
          groups.push({
            source: detailsC1.system,
            target: targetVocab,
            element: [conceptMapElement],
          });
        }
      }

      const conceptMap_ext: FhirConceptMap = {
        resourceType: FhirResourceType.conceptmap,
        group: groups,
      };
      this.logger.info('Return concept details and connections');
      return conceptMap_ext;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private mapConceptWithFhirValueSetExpansionContains(item: IConcept) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // valid_end_date is in seconds while js timestamp is in ms
    const validity =
      item.valid_end_date > Number(new Date()) / 1000 ? 'Valid' : 'Invalid';
    const details: FhirValueSetExpansionContainsWithExt = {
      conceptId: item.concept_id,
      display: item.concept_name,
      domainId: item.domain_id,
      system: item.vocabulary_id,
      conceptClassId: item.concept_class_id,
      standardConcept: item.standard_concept,
      concept:
        item.standard_concept == null || item.standard_concept !== 'S'
          ? 'Non-standard'
          : 'Standard',
      code: item.concept_code,
      // The date is stored as seconds from epoch, but new Date() expects ms
      validStartDate: item.valid_start_date
        ? new Date(item.valid_start_date * 1000).toISOString()
        : new Date(0).toISOString(),
      validEndDate: item.valid_end_date
        ? new Date(item.valid_end_date * 1000).toISOString()
        : '',
      validity,
    };
    return details;
  }

  private meilisearchResultMapping(
    meilisearchResult: IMeilisearchConcept,
  ): FhirValueSet {
    const valueSetExpansionContains = meilisearchResult.hits.map((data) => {
      return this.mapConceptWithFhirValueSetExpansionContains(data);
    });

    const valueSetExpansion: FhirValueSetExpansion = {
      total:
        meilisearchResult.hits.length > 0 ? meilisearchResult.totalHits : 0,
      offset: 1,
      timestamp: new Date(),
      contains: valueSetExpansionContains,
    };
    const result: FhirValueSet = {
      resourceType: FhirResourceType.valueset,
      expansion: valueSetExpansion,
    };
    return result;
  }
}
