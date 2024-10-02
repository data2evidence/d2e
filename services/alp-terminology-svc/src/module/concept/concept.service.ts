import { Inject, Injectable } from '@nestjs/common';
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
  Filters,
  HybridSearchConfig,
  ConceptHierarchyEdge,
  ConceptHierarchyNodeLevel,
  ConceptHierarchyNode,
} from '../../utils/types';
import { MeilisearchAPI } from '../../api/meilisearch-api';
import { Request } from 'express';
import { SystemPortalAPI } from 'src/api/portal-api';
import { HybridSearchConfigService } from '../hybrid-search-config/hybrid-search-config.service';
import { GetStandardConceptsDto } from './dto/concept.dto';
import { CachedbService } from 'src/cachedb/cachedb.service';
import { env } from 'src/env';

// Placed outside as FHIR server is unable to access
const logger = createLogger('ConceptService');
@Injectable()
export class ConceptService {
  private token: string;
  private request: Request;

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly cachedbService: CachedbService,
  ) {
    this.token = request.headers['authorization'];
    this.request = request;
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
    hybridSearchConfigService: HybridSearchConfigService,
    filters?: Filters,
  ) {
    logger.info('Get list of concepts');
    const completeFilters = {
      conceptClassId: filters?.conceptClassId ?? [],
      domainId: filters?.domainId ?? [],
      standardConcept: filters?.standardConcept ?? [],
      vocabularyId: filters?.vocabularyId ?? [],
      validity: filters?.validity ?? [],
    };
    const pageNumber = Math.floor(offset / rowsPerPage);
    const systemPortalApi = new SystemPortalAPI(this.token);
    const { databaseCode, vocabSchemaName, dialect } =
      await systemPortalApi.getDatasetDetails(datasetId);

    // If USE_DUCKDB_FTS, use duckdb fts instead of meilisearch and return early
    if (env.USE_DUCKDB_FTS) {
      logger.info('Searching with Duckdb FTS');
      return await this.cachedbService.getConcepts(
        pageNumber,
        Number(rowsPerPage),
        datasetId,
        searchText,
        vocabSchemaName,
        completeFilters,
      );
    }

    try {
      logger.info('Searching with Meilisearch');
      const meilisearchApi = new MeilisearchAPI();
      const hybridSearchConfig: HybridSearchConfig =
        await hybridSearchConfigService.getHybridSearchConfig();
      const meilisearchResult = await meilisearchApi.getConcepts(
        pageNumber,
        Number(rowsPerPage),
        searchText,
        `${databaseCode}_${vocabSchemaName}_${
          dialect === 'hana' ? 'CONCEPT' : 'concept'
        }`,
        completeFilters,
        hybridSearchConfig,
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
    const systemPortalApi = new SystemPortalAPI(this.token);
    const { databaseCode, vocabSchemaName, dialect } =
      await systemPortalApi.getDatasetDetails(datasetId);
    try {
      logger.info('Searching with Meilisearch');
      const meilisearchApi = new MeilisearchAPI();
      const meilisearchResult = await meilisearchApi.getMultipleExactConcepts(
        searchTexts,
        `${databaseCode}_${vocabSchemaName}_${
          dialect === 'hana' ? 'CONCEPT' : 'concept'
        }`,
      );
      return meilisearchResult.map(
        (result) => this.meilisearchResultMapping(result).expansion.contains[0],
      );
    } catch (err) {
      logger.error(JSON.stringify(err));
      throw err;
    }
  }
  async getStandardConcepts(
    getStandardConceptsDto: GetStandardConceptsDto,
    hybridSearchConfigService: HybridSearchConfigService,
  ): Promise<any> {
    const { data, datasetId } = getStandardConceptsDto;

    const systemPortalApi = new SystemPortalAPI(this.token);
    const { databaseCode, vocabSchemaName, dialect } =
      await systemPortalApi.getDatasetDetails(datasetId);
    const meilisearchApi = new MeilisearchAPI();

    const results = await Promise.all(
      data.map(async (dataItem) => {
        const { domainId, searchText, index } = dataItem;

        const filters: Filters = {
          conceptClassId: [],
          domainId: [],
          standardConcept: ['S'],
          vocabularyId: [],
          validity: [],
        };

        try {
          if (domainId) {
            const meiliIndex = `${databaseCode}_${vocabSchemaName}_${
              dialect === 'hana' ? 'CONCEPT' : 'concept'
            }`;
            const domainIdFacets =
              await meilisearchApi.getConceptFilterOptionsFaceted(
                meiliIndex,
                dataItem.searchText,
                { ...filters, domainId: [] },
              );

            const keyExists = Object.keys(domainIdFacets).some(
              (objKey) => objKey.toUpperCase() === domainId.toUpperCase(),
            );

            if (keyExists) {
              filters.domainId.push(domainId);
            }
          }

          const concept = await this.getConcepts(
            0,
            1,
            datasetId,
            searchText,
            hybridSearchConfigService,
            filters,
          );

          const [conceptResults] = concept.expansion.contains;

          return {
            index,
            conceptId: conceptResults.conceptId,
            conceptName: conceptResults.display,
            domainId: conceptResults.domainId,
          };
        } catch (error) {
          logger.error(error);
          throw error;
        }
      }),
    );

    return results;
  }

  async getTerminologyDetailsWithRelationships(
    conceptId: number,
    datasetId: string,
  ) {
    logger.info('Get list of concept details and connections');
    try {
      const systemPortalApi = new SystemPortalAPI(this.token);
      const { databaseCode, vocabSchemaName, dialect } =
        await systemPortalApi.getDatasetDetails(datasetId);
      logger.info('Searching with Meilisearch');
      const meilisearchApi = new MeilisearchAPI();
      const searchConcepts1: number[] = [conceptId];

      // If USE_DUCKDB_FTS, use duckdb fts instead of meilisearch and return early
      if (env.USE_DUCKDB_FTS) {
        return await this.cachedbService.getTerminologyDetailsWithRelationships(
          vocabSchemaName,
          conceptId,
          datasetId,
        );
      }

      const meilisearchResultConcept1 =
        await meilisearchApi.getMultipleExactConcepts(
          searchConcepts1,
          `${databaseCode}_${vocabSchemaName}_${
            dialect === 'hana' ? 'CONCEPT' : 'concept'
          }`,
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
          `${databaseCode}_${vocabSchemaName}_${
            dialect === 'hana' ? 'CONCEPT_RELATIONSHIP' : 'concept_relationship'
          }`,
        );
        for (let i = 0; i < conceptRelations.hits.length; i++) {
          const relationships = await meilisearchApi.getRelationships(
            conceptRelations.hits[i].relationship_id,
            `${databaseCode}_${vocabSchemaName}_${
              dialect === 'hana' ? 'RELATIONSHIP' : 'relationship'
            }`,
          );
          const searchConcepts2: number[] = [
            conceptRelations.hits[i].concept_id_2,
          ];
          const meilisearchResultConcept2 =
            await meilisearchApi.getMultipleExactConcepts(
              searchConcepts2,
              `${databaseCode}_${vocabSchemaName}_${
                dialect === 'hana' ? 'CONCEPT' : 'concept'
              }`,
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
              `${databaseCode}_${vocabSchemaName}_${
                dialect === 'hana' ? 'CONCEPT' : 'concept'
              }`,
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
      const systemPortalApi = new SystemPortalAPI(this.token);
      const { databaseCode, vocabSchemaName, dialect } =
        await systemPortalApi.getDatasetDetails(datasetId);
      logger.info('Searching with Meilisearch');
      const meilisearchApi = new MeilisearchAPI();
      const meilisearchResultCR = await meilisearchApi.getRecommendedConcepts(
        conceptIds,
        `${databaseCode}_${vocabSchemaName}_${
          dialect === 'hana' ? 'CONCEPT_RECOMMENDED' : 'concept_recommended'
        }`,
      );

      const mappedConceptIds: number[] = [];

      meilisearchResultCR.forEach((concept) => {
        concept.hits.forEach((hit) => {
          mappedConceptIds.push(hit.concept_id_2);
        });
      });

      const meilisearchResult = await meilisearchApi.getMultipleExactConcepts(
        mappedConceptIds,
        `${databaseCode}_${vocabSchemaName}_${
          dialect === 'hana' ? 'CONCEPT' : 'concept'
        }`,
        false,
      );
      return meilisearchResult
        .map((result) => {
          const mappedResult =
            this.meilisearchResultMapping(result).expansion.contains[0];

          if (mappedResult) {
            return {
              ...mappedResult,
              conceptCode: mappedResult.code,
              conceptName: mappedResult.display,
              vocabularyId: mappedResult.system,
            };
          }
          return null;
        })
        .filter((result) => result != null);
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
      const systemPortalApi = new SystemPortalAPI(this.token);
      const { databaseCode, vocabSchemaName, dialect } =
        await systemPortalApi.getDatasetDetails(datasetId);
      const meilisearchApi = new MeilisearchAPI();
      const meilisearchResult = await meilisearchApi.getConceptByName(
        conceptName,
        `${databaseCode}_${vocabSchemaName}_${
          dialect === 'hana' ? 'CONCEPT' : 'concept'
        }`,
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
    filters: Filters,
  ) {
    try {
      const systemPortalApi = new SystemPortalAPI(this.token);
      const { databaseCode, vocabSchemaName, dialect } =
        await systemPortalApi.getDatasetDetails(datasetId);
      const meilisearchApi = new MeilisearchAPI();
      const meiliIndex = `${databaseCode}_${vocabSchemaName}_${
        dialect === 'hana' ? 'CONCEPT' : 'concept'
      }`;

      // If USE_DUCKDB_FTS, use duckdb fts instead of meilisearch and return early
      if (env.USE_DUCKDB_FTS) {
        logger.info('Searching concept filters with Duckdb FTS');
        const filterOptions =
          await this.cachedbService.getConceptFilterOptionsFaceted(
            vocabSchemaName,
            datasetId,
            searchText,
            filters,
          );
        return { filterOptions };
      }

      logger.info('Searching concept filters with Meilisearch');
      const [
        conceptClassIdFacets,
        domainIdFacets,
        standardConceptFacets,
        vocabularyIdFacets,
        validity,
      ] = await Promise.all([
        meilisearchApi.getConceptFilterOptionsFaceted(meiliIndex, searchText, {
          ...filters,
          conceptClassId: [],
        }),
        meilisearchApi.getConceptFilterOptionsFaceted(meiliIndex, searchText, {
          ...filters,
          domainId: [],
        }),
        meilisearchApi.getConceptFilterOptionsFaceted(meiliIndex, searchText, {
          ...filters,
          standardConcept: [],
        }),
        meilisearchApi.getConceptFilterOptionsFaceted(meiliIndex, searchText, {
          ...filters,
          vocabularyId: [],
        }),
        meilisearchApi.getConceptFilterOptionsValidity(meiliIndex, searchText, {
          ...filters,
          validity: [],
        }),
      ]);

      const filterOptions = {
        conceptClassId: conceptClassIdFacets.facetDistribution.concept_class_id,
        domainId: domainIdFacets.facetDistribution.domain_id,
        standardConcept:
          standardConceptFacets.facetDistribution.standard_concept,
        vocabularyId: vocabularyIdFacets.facetDistribution.vocabulary_id,
        validity,
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

  async getConceptHierarchy(
    datasetId: string,
    conceptId: number,
    depth: number,
  ) {
    let edges: ConceptHierarchyEdge[] = [];
    let nodeLevels: ConceptHierarchyNodeLevel[] = [];
    let conceptIds: Set<number> = new Set<number>().add(conceptId);
    nodeLevels.push({ conceptId: conceptId, level: 0 });

    const systemPortalApi = new SystemPortalAPI(this.token);
    const { databaseCode, vocabSchemaName, dialect } =
      await systemPortalApi.getDatasetDetails(datasetId);
    const meilisearchApi = new MeilisearchAPI();
    const conceptAncestorName =
      dialect === 'hana' ? 'CONCEPT_ANCESTOR' : 'concept_ancestor';

    const conceptAncestorIndex = `${databaseCode}_${vocabSchemaName}_${conceptAncestorName}`;

    const conceptDescendants = await meilisearchApi.getDescendants(
      [conceptId],
      conceptAncestorIndex,
    );

    conceptDescendants.forEach((concept) => {
      concept.hits.forEach((hit) => {
        if (hit.descendant_concept_id !== conceptId) {
          edges.push({
            source: conceptId,
            target: hit.descendant_concept_id,
          });
          conceptIds.add(hit.descendant_concept_id);
          nodeLevels.push({
            conceptId: hit.descendant_concept_id,
            level: -1,
          });
        }
      });
    });

    // recursively get the ancestors of the specified conceptId
    const getAllAncestors = async (
      conceptId: number,
      depth: number,
      maxDepth: number,
    ) => {
      const conceptAncestors = await meilisearchApi.getAncestors(
        [conceptId],
        conceptAncestorIndex,
        1,
      );

      if (conceptAncestors.length == 0 || depth <= 0) {
        return;
      }
      conceptAncestors.forEach((concept) => {
        concept.hits.forEach((hit) => {
          if (hit.ancestor_concept_id !== conceptId) {
            edges.push({
              source: hit.ancestor_concept_id,
              target: conceptId,
            });
            conceptIds.add(hit.ancestor_concept_id);
            nodeLevels.push({
              conceptId: hit.ancestor_concept_id,
              level: maxDepth - depth + 1,
            });
            getAllAncestors(hit.ancestor_concept_id, depth - 1, maxDepth);
          }
        });
      });
    };

    await getAllAncestors(conceptId, depth, depth);

    const concepts = await this.getConceptsByIds(
      datasetId,
      Array.from(conceptIds),
    );

    const nodes: ConceptHierarchyNode[] = nodeLevels.reduce(
      (acc: ConceptHierarchyNode[], current: ConceptHierarchyNodeLevel) => {
        const conceptNode = concepts.find(
          (concept) => concept.conceptId === current.conceptId,
        );
        acc.push({
          conceptId: current.conceptId,
          display: conceptNode?.display,
          level: current.level,
        });
        return acc;
      },
      [],
    );

    return { edges, nodes };
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
