import axios, { AxiosRequestConfig } from 'axios';
import { InternalServerErrorException } from '@nestjs/common';
import { Agent } from 'https';
import { env } from '../env';
import { createLogger } from '../logger';
import {
  IMeilisearchConcept,
  IMeilisearchGetConceptRecommended,
  IMeilisearchGetDescendants,
  IMeilisearchGetMapped,
  IMeilisearchRelationship,
} from '../utils/types';
import { INDEX_ATTRIBUTES } from '../utils/constants';

export class MeilisearchAPI {
  private readonly url: string;
  private readonly httpsAgent: Agent;
  private readonly logger = createLogger(this.constructor.name);

  constructor() {
    if (env.MEILISEARCH__API_URL) {
      this.url = env.MEILISEARCH__API_URL;
      this.httpsAgent = new Agent({
        rejectUnauthorized:
          this.url.startsWith('https://localhost:') ||
          this.url.startsWith('https://alp-minerva-meilisearch-')
            ? false
            : true,
      });
    } else {
      throw new Error('No url is set for MeilisearchAPI');
    }
  }

  async getConcepts(
    pageNumber = 0,
    rowsPerPage: number,
    searchText = '',
    index: string,
    filters: {
      conceptClassId: string[];
      domainId: string[];
      standardConcept: string[];
      vocabularyId: string[];
    },
  ): Promise<IMeilisearchConcept> {
    const errorMessage = 'Error while getting concepts';
    try {
      const options = await this.createOptions();
      const url = `${this.url}indexes/${index}/search`;
      const data = {
        q: searchText,
        page: pageNumber + 1,
        hitsPerPage: rowsPerPage,
        attributesToSearchOn: [
          INDEX_ATTRIBUTES.concept.conceptName,
          INDEX_ATTRIBUTES.concept.conceptCode,
          INDEX_ATTRIBUTES.concept.conceptClassId,
          INDEX_ATTRIBUTES.concept.domainId,
          INDEX_ATTRIBUTES.concept.vocabularyId,
        ],
        filter: this.generateMeiliFilter(filters),
      };
      const result = await axios.post<IMeilisearchConcept>(url, data, options);
      return result.data;
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getMultipleExactConcepts(
    searchTexts: number[],
    index: string,
    includeInvalid = true,
  ): Promise<IMeilisearchConcept[]> {
    try {
      const options = await this.createOptions();
      const url = `${this.url}multi-search`;
      const invalidFilter = includeInvalid
        ? []
        : [
            [
              `${INDEX_ATTRIBUTES.concept.invalidReason} IS NULL`,
              `${INDEX_ATTRIBUTES.concept.invalidReason} IS EMPTY`,
            ],
          ];
      const queries = searchTexts.map((searchText) => {
        const exactSearchFilter: (string | string[])[] = [
          `${INDEX_ATTRIBUTES.concept.conceptId} = '${searchText}'`,
        ];

        const filter = exactSearchFilter.concat(invalidFilter);
        return {
          indexUid: index,
          limit: 1,
          filter,
        };
      });
      const result = await axios.post<{ results: IMeilisearchConcept[] }>(
        url,
        { queries },
        options,
      );
      return result.data.results;
    } catch (error) {
      const errorMessage = `Error while getting multiple exact values from index: ${index} and searchText: ${searchTexts}`;
      this.logger.error(`${errorMessage}: ${error}`);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getDescendants(
    searchTexts: number[],
    index: string,
  ): Promise<IMeilisearchGetDescendants[]> {
    try {
      const options = await this.createOptions();
      const url = `${this.url}multi-search`;
      const queries = searchTexts.map((searchText) => {
        return {
          indexUid: index,
          limit: 9999999,
          filter: [
            [
              `${INDEX_ATTRIBUTES.concept_ancestor.ancestorConceptId} = '${searchText}'`,
            ],
          ],
        };
      });
      const result = await axios.post<{
        results: IMeilisearchGetDescendants[];
      }>(url, { queries }, options);
      return result.data.results;
    } catch (error) {
      const errorMessage = `Error while getting descendant values from index: ${index} and searchText: ${searchTexts}`;
      this.logger.error(`${errorMessage}: ${error}`);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getMapped(
    searchTexts: number[],
    index: string,
  ): Promise<IMeilisearchGetMapped[]> {
    try {
      const options = await this.createOptions();
      const url = `${this.url}multi-search`;
      const queries = searchTexts.map((searchText) => {
        return {
          indexUid: index,
          limit: 9999999,
          filter: [
            [
              `${INDEX_ATTRIBUTES.concept_relationship.conceptId2} = '${searchText}'`,
            ],
            [
              `${INDEX_ATTRIBUTES.concept_relationship.invalidReason} IS NULL`,
              `${INDEX_ATTRIBUTES.concept_relationship.invalidReason} IS EMPTY`,
            ],
            [
              `${INDEX_ATTRIBUTES.concept_relationship.relationshipId} = 'Maps to'`,
            ],
          ],
        };
      });
      const result = await axios.post<{
        results: IMeilisearchGetMapped[];
      }>(url, { queries }, options);
      return result.data.results;
    } catch (error) {
      const errorMessage = `Error while getting mapped values from index: ${index} and searchText: ${searchTexts}`;
      this.logger.error(`${errorMessage}: ${error}`);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getConceptFilterOptions(
    index: string,
    searchText: string,
    filters: {
      conceptClassId: string[];
      domainId: string[];
      standardConcept: string[];
      vocabularyId: string[];
    },
  ): Promise<IMeilisearchConcept> {
    // Facet search has a 100 result limit, which is not affected by maxValuesPerFacet setting.
    // Hence using normal search as workaround to get all facets
    // https://www.meilisearch.com/docs/learn/advanced/known_limitations#facet-search-limitation

    const options = await this.createOptions();
    const url = `${this.url}indexes/${index}/search`;
    const data = {
      q: searchText,
      facets: ['*'],
      filter: this.generateMeiliFilter(filters),
      // Since we do not need the search results, just getting 1 value
      // using page and hitsPerPage instead of limit to get access to totalHits
      page: 1,
      hitsPerPage: 1,
    };
    const result = await axios.post<IMeilisearchConcept>(url, data, options);
    return result.data;
  }

  private async createOptions(): Promise<AxiosRequestConfig> {
    return {
      headers: {
        Authorization: `Bearer ${env.MEILI_MASTER_KEY}`,
      },
      httpsAgent: this.httpsAgent,
    };
  }

  private generateMeiliFilter(filters: {
    conceptClassId: string[];
    domainId: string[];
    standardConcept: string[];
    vocabularyId: string[];
  }): string[][] {
    // Filter is an array of array which is needed for OR and AND logic
    // https://www.meilisearch.com/docs/learn/fine_tuning_results/filtering#creating-filter-expressions-with-arrays
    const conceptClassIdFilter = filters.conceptClassId.map((filterValue) => {
      return `${INDEX_ATTRIBUTES.concept.conceptClassId} = '${filterValue}'`;
    });
    const domainIdFilter = filters.domainId.map((filterValue) => {
      return `${INDEX_ATTRIBUTES.concept.domainId} = '${filterValue}'`;
    });
    const standardConceptFilter = filters.standardConcept.map((filterValue) => {
      if (filterValue === 'S')
        return `${INDEX_ATTRIBUTES.concept.standardConcept} = 'S'`;
      else return `${INDEX_ATTRIBUTES.concept.standardConcept} != 'S'`;
    });
    const vocabularyIdFilter = filters.vocabularyId.map((filterValue) => {
      return `${INDEX_ATTRIBUTES.concept.vocabularyId} = '${filterValue}'`;
    });
    return [
      conceptClassIdFilter,
      domainIdFilter,
      standardConceptFilter,
      vocabularyIdFilter,
    ];
  }

  async getConceptRelationships(
    conceptId: number,
    index: string,
  ): Promise<IMeilisearchGetMapped> {
    const options = await this.createOptions();
    const url = `${this.url}indexes/${index}/search`;
    const data = {
      q: `${conceptId}`,
      attributesToSearchOn: [INDEX_ATTRIBUTES.concept_relationship.conceptId1],
    };
    const result = await axios.post<IMeilisearchGetMapped>(url, data, options);
    return result.data;
  }

  async getRelationships(
    relationshipId: string,
    index: string,
  ): Promise<IMeilisearchRelationship> {
    const options = await this.createOptions();
    const url = `${this.url}indexes/${index}/search`;
    const data = {
      filter: [
        [
          `${INDEX_ATTRIBUTES.relationship.relationshipId} = '${relationshipId}'`,
        ],
      ],
    };
    const result = await axios.post<IMeilisearchRelationship>(
      url,
      data,
      options,
    );
    return result.data;
  }

  async getRecommendedConcepts(
    searchConceptIds: number[],
    index: string,
  ): Promise<IMeilisearchGetConceptRecommended[]> {
    const options = await this.createOptions();
    const url = `${this.url}multi-search`;
    const queries = searchConceptIds.map((conceptId) => {
      const exactSearchFilter = [
        `${INDEX_ATTRIBUTES.concept_recommended.conceptId1} = '${conceptId}'`,
      ];

      const filter = exactSearchFilter.concat();
      return {
        indexUid: index,
        limit: 1,
        filter,
      };
    });
    const result = await axios.post<{ results: IMeilisearchGetConceptRecommended[] }>(
      url,
      { queries },
      options,
    );
    return result.data.results;
  }

  async getConceptByName(
    conceptName: string,
    index: string,
  ): Promise<IMeilisearchConcept> {
    const errorMessage = 'Error while getting concepts';
    try {
      const options = await this.createOptions();
      const url = `${this.url}indexes/${index}/search`;
      const data = {
        filter: [
          [`${INDEX_ATTRIBUTES.concept.conceptName} = '${conceptName}'`],
          [`${INDEX_ATTRIBUTES.concept.standardConcept} = 'S'`],
        ],
      };
      const result = await axios.post<IMeilisearchConcept>(url, data, options);
      return result.data;
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
