import { Injectable } from '@nestjs/common';
import { createLogger } from '../../logger';
import {
  Filters,
  ConceptHierarchyEdge,
  ConceptHierarchyNodeLevel,
  ConceptHierarchyNode,
} from '../../utils/types';
import { GetStandardConceptsDto } from './dto/concept.dto';
import { CachedbService } from 'src/module/cachedb/cachedb.service';

// Placed outside as FHIR server is unable to access
const logger = createLogger('ConceptService');
@Injectable()
export class ConceptService {
  constructor(private readonly cachedbService: CachedbService) {}

  async getConcepts(
    offset: number,
    rowsPerPage: number,
    datasetId: string,
    searchText: string,
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

    try {
      return await this.cachedbService.getConcepts(
        pageNumber,
        Number(rowsPerPage),
        datasetId,
        searchText,
        completeFilters,
      );
    } catch (err) {
      logger.error(JSON.stringify(err));
      throw err;
    }
  }

  async getStandardConcepts(
    getStandardConceptsDto: GetStandardConceptsDto,
  ): Promise<any> {
    const { data, datasetId } = getStandardConceptsDto;

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
            const domainIdFacets = (
              await this.cachedbService.getConceptFilterOptionsFaceted(
                datasetId,
                dataItem.searchText,
                filters,
              )
            ).domainId;

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
      return await this.cachedbService.getTerminologyDetailsWithRelationships(
        conceptId,
        datasetId,
      );
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async getRecommendedConcepts(conceptIds: number[], datasetId: string) {
    try {
      return await this.cachedbService.getRecommendedConcepts(
        conceptIds,
        datasetId,
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
      return await this.cachedbService.getExactConcept(
        conceptName,
        datasetId,
        'concept_name',
      );
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async searchConceptById({
    conceptId,
    datasetId,
  }: {
    conceptId: number;
    datasetId: string;
  }) {
    try {
      return await this.cachedbService.getExactConcept(
        conceptId,
        datasetId,
        'concept_id',
      );
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async searchConceptByCode({
    conceptCode,
    datasetId,
  }: {
    conceptCode: string;
    datasetId: string;
  }) {
    try {
      return await this.cachedbService.getExactConcept(
        conceptCode,
        datasetId,
        'concept_code',
      );
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
      const filterOptions =
        await this.cachedbService.getConceptFilterOptionsFaceted(
          datasetId,
          searchText,
          filters,
        );
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
    const edges: ConceptHierarchyEdge[] = [];
    const nodeLevels: ConceptHierarchyNodeLevel[] = [];
    const conceptIds: Set<number> = new Set<number>().add(conceptId);
    nodeLevels.push({ conceptId: conceptId, level: 0 });

    const conceptDescendants = await this.cachedbService.getDescendants(
      [conceptId],
      datasetId,
    );
    conceptDescendants.forEach((concept_ancestor) => {
      if (concept_ancestor.descendant_concept_id !== conceptId) {
        edges.push({
          source: conceptId,
          target: concept_ancestor.descendant_concept_id,
        });
        conceptIds.add(concept_ancestor.descendant_concept_id);
        nodeLevels.push({
          conceptId: concept_ancestor.descendant_concept_id,
          level: -1,
        });
      }
    });

    // recursively get the ancestors of the specified conceptId
    const getAllAncestors = async (
      conceptId: number,
      depth: number,
      maxDepth: number,
    ) => {
      const conceptAncestors = await this.cachedbService.getAncestors(
        [conceptId],
        datasetId,
        1,
      );

      if (conceptAncestors.length == 0 || depth <= 0) {
        return;
      }
      conceptAncestors.forEach((concept_ancestor) => {
        if (concept_ancestor.ancestor_concept_id !== conceptId) {
          edges.push({
            source: concept_ancestor.ancestor_concept_id,
            target: conceptId,
          });
          conceptIds.add(concept_ancestor.ancestor_concept_id);
          nodeLevels.push({
            conceptId: concept_ancestor.ancestor_concept_id,
            level: maxDepth - depth + 1,
          });
          getAllAncestors(
            concept_ancestor.ancestor_concept_id,
            depth - 1,
            maxDepth,
          );
        }
      });
    };

    await getAllAncestors(conceptId, depth, depth);

    const concepts = await this.cachedbService.getConceptsByIds(
      Array.from(conceptIds),
      datasetId,
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
}
