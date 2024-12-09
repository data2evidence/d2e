const pg = require('pg');
import { createLogger } from '../../logger';
import { Filters } from '../../utils/types';
import { env } from 'src/env';
import { INDEX_ATTRIBUTES } from '../../utils/constants';
import {
  IDuckdbConcept,
  IConceptRecommended,
  IConceptAncestor,
} from '../../utils/types';

export class CachedbDAO {
  private readonly jwt: string;
  private readonly datasetId: string;
  private readonly vocabSchemaName: string;
  private readonly logger = createLogger(this.constructor.name);

  constructor(jwt: string, datasetId: string, vocabSchemaName: string) {
    this.jwt = jwt;
    this.datasetId = datasetId;
    this.vocabSchemaName = vocabSchemaName;
    if (!jwt) {
      throw new Error('No token passed for CachedbDAO!');
    }
  }

  async getConcepts(
    pageNumber = 0,
    rowsPerPage: number,
    searchText = '',
    filters: Filters,
  ) {
    const client = this.getCachedbConnection(this.jwt, this.datasetId);
    try {
      const [duckdbFtsBaseQuery, duckdbFtsBaseQueryParams] =
        this.getDuckdbFtsBaseQuery(searchText, filters);
      const conceptsSql = `
      ${duckdbFtsBaseQuery}
      select *
          from fts
          limit ? OFFSET ?;
          `;

      const offset = pageNumber * rowsPerPage;
      const conceptsSqlParams = [
        ...duckdbFtsBaseQueryParams,
        rowsPerPage,
        offset,
      ];

      const countSql = `${duckdbFtsBaseQuery} select count(concept_id) as count from fts`;
      const countSqlParams = duckdbFtsBaseQueryParams;
      const sqlPromises = [
        client.query(conceptsSql, conceptsSqlParams),
        client.query(countSql, countSqlParams),
      ];
      const results = await Promise.all(sqlPromises);

      const data = {
        hits: results[0].rows,
        totalHits: results[1] ? parseInt(results[1].rows[0].count) : 0,
      };
      return data;
    } catch (error) {
      this.logger.error(error);
    } finally {
      await client.end();
    }
  }

  async getMultipleExactConcepts(
    searchTexts: number[],
    includeInvalid = true,
  ): Promise<IDuckdbConcept> {
    const client = this.getCachedbConnection(this.jwt, this.datasetId);
    try {
      const searchTextWhereclause =
        searchTexts.reduce((accumulator, searchText, index: number) => {
          accumulator += `$${index + 1},`;
          return accumulator;
        }, `${INDEX_ATTRIBUTES.concept.conceptId} IN (`) + ') ';

      const invalidReasonWhereClause = includeInvalid
        ? ''
        : `AND ${INDEX_ATTRIBUTES.concept.invalidReason} = '' `;

      const sql = `
        select *
        from ${this.vocabSchemaName}.concept
        WHERE 
        ${searchTextWhereclause}
        ${invalidReasonWhereClause}
        `;

      const result = await client.query(sql, [...searchTexts]);
      if (result) {
        const data = {
          hits: result.rows,
          totalHits: result.rowCount,
        };
        return data;
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error(error);
    } finally {
      await client.end();
    }
  }

  async getConceptFilterOptionsFaceted(
    searchText: string,
    filters: Filters,
  ): Promise<any> {
    const facetColumns = {
      conceptClassId: 'concept_class_id',
      domainId: 'domain_id',
      standardConcept: 'standard_concept',
      vocabularyId: 'vocabulary_id',
      validity: 'valid_end_date',
    };

    const getFacetSql = (column: string): string => {
      return `
            select
              ${column},
              COUNT(${column}) as count
            from
              fts
            GROUP BY
              ${column};
          `;
    };
    const getValidityFacetSql = (column: string): string => {
      return `
            select
              valid_end_date,
              count(a.valid_end_date) as count
            from
              (
                SELECT
                  CASE
                    WHEN ${column} >= current_date THEN 'Valid'
                    ELSE 'Invalid'
                  end AS valid_end_date
                FROM
                  fts
              ) as a
            GROUP BY
              a.valid_end_date;
          `;
    };

    const client = this.getCachedbConnection(this.jwt, this.datasetId);
    try {
      const facetPromises = Object.values(facetColumns).map(
        (column: string) => {
          const [duckdbFtsBaseQuery, duckdbFtsBaseQueryParams] =
            this.getDuckdbFtsBaseQuery(searchText, filters, [column]);
          let facetSql;
          if (column === 'valid_end_date') {
            facetSql = getValidityFacetSql(column);
          } else {
            facetSql = getFacetSql(column);
          }
          const sql = `
            ${duckdbFtsBaseQuery}
            ${facetSql}
          `;
          const sqlParams = duckdbFtsBaseQueryParams;
          return client.query(sql, sqlParams);
        },
      );

      const results = await Promise.all(facetPromises).then(function (data) {
        return data.map((result) => {
          return result.rows;
        });
      });

      // Map data to match existing concept.service logic which works with meilisearch search results
      const filterOptions = Object.entries(facetColumns).reduce<{
        [index: string]: any;
      }>((accumulator, [facetKey, facetColumn], index: number) => {
        const result = results[index];
        const fields = [facetColumn, 'count'];

        accumulator[facetKey] = result.reduce(
          (
            accumulator: { [index: string]: number },
            { [fields[0]]: facetColumn, [fields[1]]: count }: any,
          ) => {
            accumulator[facetColumn] = Number(count);
            return accumulator;
          },
          {},
        );
        return accumulator;
      }, {});
      // concept is a derived value, not from duckdb fts index search
      filterOptions['concept'] = (() => {
        const standardConcepts = filterOptions['standardConcept'];
        const standardConceptsCount = standardConcepts['S'] || 0;

        const totalConceptsCount = Object.values(standardConcepts).reduce(
          (accumulator: number, value) => accumulator + Number(value),
          0,
        );

        const nonStandardConceptsCount =
          totalConceptsCount - standardConceptsCount;
        return {
          Standard: standardConceptsCount,
          'Non-standard': nonStandardConceptsCount,
        };
      })();
      return filterOptions;
    } catch (error) {
      this.logger.error(error);
    } finally {
      await client.end();
    }
  }

  private getDuckdbFtsBaseQuery = (
    searchText: string,
    filters: Filters,
    columns: string[] = [],
  ): [string, string[]] => {
    const filterWhereClause = this.generateFilterWhereClause(filters);

    const columnsToSelect = columns.length === 0 ? '*' : columns.join(', ');

    if (searchText === '') {
      return [
        `
      with fts as (
        select
          ${columnsToSelect}
        from
          ${this.vocabSchemaName}.concept
          ${filterWhereClause}
        )
      `,
        [],
      ];
    } else {
      const duckdbFtsWhereClause = filterWhereClause
        ? `${filterWhereClause} AND score is not null`
        : 'WHERE score is not null ';
      return [
        `
      with fts as (
        select
          ${columnsToSelect},
          ${this.vocabSchemaName}.fts_main_concept.match_bm25(concept_id, ?) as score
        from
          ${this.vocabSchemaName}.concept
          ${duckdbFtsWhereClause} 
          order by score desc
        )
      `,
        [searchText],
      ];
    }
  };

  private generateFilterWhereClause(filters: Filters): string {
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySeconds = Math.floor(Number(today) / 1000);
    const validityFilter = filters.validity.map((filterValue) => {
      if (filterValue === 'Valid') {
        return `${INDEX_ATTRIBUTES.concept.validEndDate} >= ${todaySeconds}`;
      } else {
        return `${INDEX_ATTRIBUTES.concept.validEndDate} < ${todaySeconds}`;
      }
    });

    const filterList = [
      ...conceptClassIdFilter,
      ...domainIdFilter,
      ...standardConceptFilter,
      ...vocabularyIdFilter,
      ...validityFilter,
    ];

    if (filterList.length === 0) {
      return '';
    } else {
      return ` WHERE ${filterList.join(' AND ')}`;
    }
  }

  async getConceptRelationships(conceptId: number): Promise<any> {
    const client = this.getCachedbConnection(this.jwt, this.datasetId);
    try {
      const sql = `
      select *
          from ${this.vocabSchemaName}.concept_relationship
          WHERE ${INDEX_ATTRIBUTES.concept_relationship.conceptId1}=$1
          `;
      const result = await client.query(sql, [conceptId]);

      const data = {
        hits: result.rows,
        totalHits: result.rowCount,
      };
      return data;
    } catch (error) {
      this.logger.error(error);
    } finally {
      await client.end();
    }
  }

  async getRelationships(relationshipId: number): Promise<any> {
    const client = this.getCachedbConnection(this.jwt, this.datasetId);
    try {
      const sql = `
      select *
          from ${this.vocabSchemaName}.relationship
          WHERE ${INDEX_ATTRIBUTES.relationship.relationshipId}=$1
          `;
      const result = await client.query(sql, [relationshipId]);
      const data = {
        hits: result.rows,
        totalHits: result.rowCount,
      };
      return data;
    } catch (error) {
      this.logger.error(error);
    } finally {
      await client.end();
    }
  }

  // async getConceptByName(conceptName: string): Promise<any> {
  //   const client = this.getCachedbConnection(this.jwt, this.datasetId);
  //   const filters: Filters = {
  //     conceptClassId: [],
  //     domainId: [],
  //     standardConcept: ['S'],
  //     vocabularyId: [],
  //     validity: ['Valid'],
  //   };
  //   try {
  //     const [duckdbFtsBaseQuery, duckdbFtsBaseQueryParams] =
  //       this.getDuckdbFtsBaseQuery(conceptName, filters);
  //     const sql = `
  //       ${duckdbFtsBaseQuery}
  //       select concept_id, concept_name, domain_id, vocabulary_id, concept_class_id, standard_concept, concept_code, valid_start_date, valid_end_date, invalid_reason from fts
  //           `;
  //     const result = await client.query(sql, [...duckdbFtsBaseQueryParams]);
  //     return result.rows;
  //   } catch (error) {
  //     this.logger.error(error);
  //   } finally {
  //     await client.end();
  //   }
  // }

  async getExactConcept(
    conceptName: string | number,
    conceptColumnName: 'concept_name' | 'concept_id' | 'concept_code',
  ): Promise<any> {
    const client = this.getCachedbConnection(this.jwt, this.datasetId);
    try {
      const sql = `
        select concept_id, concept_name, domain_id, vocabulary_id, concept_class_id, standard_concept, concept_code, valid_start_date, valid_end_date, invalid_reason from ${this.vocabSchemaName}.concept WHERE ${conceptColumnName}=? AND standard_concept='S';
            `;
      const result = await client.query(sql, [conceptName]);
      return result.rows;
    } catch (error) {
      this.logger.error(error);
    } finally {
      await client.end();
    }
  }

  async getExactConceptRecommended(
    searchConceptIds: number[],
  ): Promise<IConceptRecommended[]> {
    const client = this.getCachedbConnection(this.jwt, this.datasetId);
    try {
      const sql = `
        select concept_id_1, concept_id_2, relationship_id from ${this.vocabSchemaName}.concept_recommended WHERE concept_id_1 IN (?);
            `;
      const result = await client.query(sql, [searchConceptIds.join(', ')]);
      return result.rows;
    } catch (error) {
      this.logger.error(error);
    } finally {
      await client.end();
    }
  }

  async getExactConceptDescendants(
    searchConceptIds: number[],
  ): Promise<IConceptAncestor[]> {
    const client = this.getCachedbConnection(this.jwt, this.datasetId);
    try {
      const sql = `
        select ancestor_concept_id, descendant_concept_id, min_levels_of_separation, max_levels_of_separation from ${this.vocabSchemaName}.concept_ancestor WHERE ancestor_concept_id IN (?);
            `;
      const result = await client.query(sql, [searchConceptIds.join(', ')]);
      return result.rows;
    } catch (error) {
      this.logger.error(error);
    } finally {
      await client.end();
    }
  }

  async getExactConceptAncestors(
    searchConceptIds: number[],
    level: number,
  ): Promise<IConceptAncestor[]> {
    const client = this.getCachedbConnection(this.jwt, this.datasetId);
    try {
      const sql = `
        select ancestor_concept_id, descendant_concept_id, min_levels_of_separation, max_levels_of_separation from ${this.vocabSchemaName}.concept_ancestor WHERE descendant_concept_id IN (?) AND min_levels_of_separation = (?);
            `;
      const result = await client.query(sql, [
        searchConceptIds.join(', '),
        level,
      ]);
      return result.rows;
    } catch (error) {
      this.logger.error(error);
    } finally {
      await client.end();
    }
  }

  private getCachedbConnection = (jwt: string, datasetId: string) => {
    try {
      const client = new pg.Client({
        host: env.CACHEDB__HOST,
        port: env.CACHEDB__PORT,
        user: jwt,
        database: `A|duckdb|read|${datasetId}`,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 30000,
      });
      client.connect();
      return client;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  };
}
