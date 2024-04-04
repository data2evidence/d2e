import {
  Inject,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { createLogger } from '../../logger';
import { groupBy } from 'src/utils/helperUtil';
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
} from '../../utils/types';
import { SystemPortalAPI } from '../../api/portal-api';
import { MeilisearchAPI } from '../../api/meilisearch-api';
import { Request } from 'express';
import * as datefns from 'date-fns';

// Placed outside as FHIR server is unable to access
const logger = createLogger('ConceptService');
@Injectable()
export class ConceptService {
  private token: string;

  constructor(@Inject(REQUEST) request: Request) {
    this.token = request.headers['authorization'];
  }

  // Used by FHIR server, where request cannot be injected as it does not use nest
  setToken(token: string) {
    this.token = token;
  }

  async getConcepts(
    offset: number,
    rowsPerPage: number,
    datasetId: string,
    searchText: string,
    filters?: {
      conceptClassId: string[];
      domainId: string[];
      standardConcept: string[];
      vocabularyId: string[];
    },
  ) {
    logger.info('Get list of concepts');
    const pageNumber = Math.floor(offset / rowsPerPage);
    const { databaseName, vocabSchemaName } = await this.getDatasetDetails(
      datasetId,
      this.token,
    );
    try {
      logger.info('Searching with Meilisearch');
      const meilisearchApi = new MeilisearchAPI();
      const meilisearchResult = await meilisearchApi.getConcepts(
        pageNumber,
        Number(rowsPerPage),
        searchText,
        `${databaseName}_${vocabSchemaName}_concept`,
        filters,
      );
      return this.meilisearchResultMapping(meilisearchResult);
    } catch (err) {
      logger.error(JSON.stringify(err));
      throw err;
    }
  }

  async getConceptsByIds(
    datasetId: string,
    searchTexts: number[],
  ): Promise<FhirValueSetExpansionContainsWithExt[]> {
    logger.info('Get list of concepts');
    const { databaseName, vocabSchemaName } = await this.getDatasetDetails(
      datasetId,
      this.token,
    );
    try {
      logger.info('Searching with Meilisearch');
      const meilisearchApi = new MeilisearchAPI();
      const meilisearchResult = await meilisearchApi.getMultipleExactConcepts(
        searchTexts,
        `${databaseName}_${vocabSchemaName}_concept`,
      );
      return meilisearchResult.map(
        (result) => this.meilisearchResultMapping(result).expansion.contains[0],
      );
    } catch (err) {
      logger.error(JSON.stringify(err));
      throw err;
    }
  }

  async getTerminologyDetailsWithRelationships(
    conceptId: number,
    datasetId: string,
  ) {
    logger.info('Get list of concept details and connections');
    try {
      const { databaseName, vocabSchemaName } = await this.getDatasetDetails(
        datasetId,
        this.token,
      );
      logger.info('Searching with Meilisearch');
      const meilisearchApi = new MeilisearchAPI();
      const searchConcepts1: number[] = [conceptId];
      const meilisearchResultConcept1 =
        await meilisearchApi.getMultipleExactConcepts(
          searchConcepts1,
          `${databaseName}_${vocabSchemaName}_concept`,
          true,
        );
      const conceptC1: FhirValueSet[] = meilisearchResultConcept1.map(
        (result) => this.meilisearchResultMapping(result),
      );
      const groups: FhirConceptMapGroup[] = [];
      if (conceptC1[0].expansion.contains.length > 0) {
        const detailsC1: FhirValueSetExpansionContainsWithExt =
          conceptC1[0].expansion.contains[0];

        const fhirTargetElements: FhirConceptMapElementTarget[] = [];

        const conceptRelations = await meilisearchApi.getConceptRelationships(
          detailsC1.conceptId,
          `${databaseName}_${vocabSchemaName}_concept_relationship`,
        );
        for (let i = 0; i < conceptRelations.hits.length; i++) {
          const relationships = await meilisearchApi.getRelationships(
            conceptRelations.hits[i].relationship_id,
            `${databaseName}_${vocabSchemaName}_relationship`,
          );
          const searchConcepts2: number[] = [
            conceptRelations.hits[i].concept_id_2,
          ];
          const meilisearchResultConcept2 =
            await meilisearchApi.getMultipleExactConcepts(
              searchConcepts2,
              `${databaseName}_${vocabSchemaName}_concept`,
              true,
            );
          const conceptC2: FhirValueSet[] = meilisearchResultConcept2.map(
            (result) => this.meilisearchResultMapping(result),
          );
          const detailsC2: FhirValueSetExpansionContainsWithExt =
            conceptC2[0].expansion.contains[0];
          if (!detailsC2) {
            continue;
          }
          const searchConcepts3: number[] = [
            relationships.hits[0].relationship_concept_id,
          ];
          const meilisearchResultConcept3 =
            await meilisearchApi.getMultipleExactConcepts(
              searchConcepts3,
              `${databaseName}_${vocabSchemaName}_concept`,
              true,
            );
          const conceptC3: FhirValueSet[] = meilisearchResultConcept3.map(
            (result) => this.meilisearchResultMapping(result),
          );
          const detailsC3: FhirValueSetExpansionContainsWithExt =
            conceptC3[0].expansion.contains[0];
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
            valueSet: conceptC1[0],
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
      logger.info('Return concept details and connections');
      return conceptMap_ext;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async getRecommendedConcepts(conceptIds: number[], datasetId: string) {
    try {
      const { databaseName, vocabSchemaName } = await this.getDatasetDetails(
        datasetId,
        this.token,
      );
      logger.info('Searching with Meilisearch');
      const meilisearchApi = new MeilisearchAPI();
      const meilisearchResultCR = await meilisearchApi.getRecommendedConcepts(
        conceptIds,
        `${databaseName}_${vocabSchemaName}_concept_recommended`,
      );

      const mappedConceptIds: number[] = [];

      meilisearchResultCR.forEach((concept) => {
        concept.hits.forEach((hit) => {
          mappedConceptIds.push(hit.concept_id_2);
        });
      });

      const meilisearchResult = await meilisearchApi.getMultipleExactConcepts(
        mappedConceptIds,
        `${databaseName}_${vocabSchemaName}_concept`,
        false,
      );
      return meilisearchResult.map(
        (result) => this.meilisearchResultMapping(result).expansion.contains[0],
      );
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async searchConceptByName({
    conceptName,
    datasetId,
  }: {
    conceptName: string;
    datasetId: string;
  }) {
    try {
      const { databaseName, vocabSchemaName } = await this.getDatasetDetails(
        datasetId,
        this.token,
      );
      const meilisearchApi = new MeilisearchAPI();
      const meilisearchResult = await meilisearchApi.getConceptByName(
        conceptName,
        `${databaseName}_${vocabSchemaName}_concept`,
      );
      const fhirValueSet = this.meilisearchResultMapping(meilisearchResult);
      const concepts = fhirValueSet.expansion.contains.map((fhirconcept) => {
        return {
          concept_id: fhirconcept.conceptId,
          concept_name: fhirconcept.display,
          domain_id: fhirconcept.domainId,
          vocabulary_id: fhirconcept.system,
          concept_class_id: fhirconcept.conceptClassId,
          standard_concept: fhirconcept.standardConcept,
          concept_code: fhirconcept.code,
          valid_start_date: fhirconcept.validStartDate,
          valid_end_date: fhirconcept.validEndDate,
          invalid_reason: fhirconcept.validity,
        };
      });
      return concepts;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async getConceptFilterOptions(
    datasetId: string,
    searchText: string,
    filters: {
      conceptClassId: string[];
      domainId: string[];
      standardConcept: string[];
      vocabularyId: string[];
    },
  ) {
    try {
      const { databaseName, vocabSchemaName } = await this.getDatasetDetails(
        datasetId,
        this.token,
      );
      const meilisearchApi = new MeilisearchAPI();
      const meiliIndex = `${databaseName}_${vocabSchemaName}_concept`;
      const conceptClassIdFacets = await meilisearchApi.getConceptFilterOptions(
        meiliIndex,
        searchText,
        { ...filters, conceptClassId: [] },
      );
      const domainIdFacets = await meilisearchApi.getConceptFilterOptions(
        meiliIndex,
        searchText,
        { ...filters, domainId: [] },
      );
      const standardConceptFacets =
        await meilisearchApi.getConceptFilterOptions(meiliIndex, searchText, {
          ...filters,
          standardConcept: [],
        });
      const vocabularyIdFacets = await meilisearchApi.getConceptFilterOptions(
        meiliIndex,
        searchText,
        { ...filters, vocabularyId: [] },
      );
      const filterOptions = {
        conceptClassId: conceptClassIdFacets.facetDistribution.concept_class_id,
        domainId: domainIdFacets.facetDistribution.domain_id,
        standardConcept:
          standardConceptFacets.facetDistribution.standard_concept,
        vocabularyId: vocabularyIdFacets.facetDistribution.vocabulary_id,
        // concept is a derived value, not from meilisearch index
        concept: (() => {
          const standardConcepts =
            standardConceptFacets.facetDistribution.standard_concept;
          const standardConceptsCount = standardConcepts['S'] || 0;
          const nonStandardConceptsCount =
            standardConceptFacets.totalHits - standardConceptsCount;
          return {
            Standard: standardConceptsCount,
            'Non-standard': nonStandardConceptsCount,
          };
        })(),
      };
      return { filterOptions };
    } catch (err) {
      logger.error(err);
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
      validStartDate: item.valid_start_date
        ? new Date(item.valid_start_date).toISOString()
        : '',
      validEndDate: item.valid_end_date
        ? new Date(item.valid_end_date).toISOString()
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

  private async getDatasetDetails(datasetId: string, token: string) {
    const systemPortalApi = new SystemPortalAPI(token);
    const dataset = await systemPortalApi.getDataset(datasetId);
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
      databaseName: dataset.databaseCode,
      vocabSchemaName: dataset.vocabSchemaName,
    };
  }
}
