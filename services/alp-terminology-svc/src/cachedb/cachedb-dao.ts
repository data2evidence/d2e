const pg = require('pg');
import { createLogger } from '../logger';
import { Filters } from '../utils/types';
import { env } from 'src/env';
import { INDEX_ATTRIBUTES } from '../utils/constants';

export class CachedbDAO {
  private readonly jwt: string;
  private readonly datasetId: string;
  private readonly logger = createLogger(this.constructor.name);

  constructor(jwt: string, datasetId: string) {
    this.jwt = jwt;
    this.datasetId = datasetId;
    if (!jwt) {
      throw new Error('No token passed for CachedbDAO!');
    }
  }

  async getConcepts(
    pageNumber = 0,
    rowsPerPage: number,
    searchText = '',
    vocab_file_name: string,
    filters: Filters,
  ) {
    const client = getCachedbConnection(this.jwt, this.datasetId);
    try {
      const duckdbFtsBaseQuery = this.getDuckdbFtsBaseQuery(
        vocab_file_name,
        filters,
      );
      const conceptsSql = `
      ${duckdbFtsBaseQuery}
      select *
          from fts
          order by score desc
          limit $2 OFFSET $3;
          `;
      const countSql = `${duckdbFtsBaseQuery} select count(score) as count from fts`;
      const sqlPromises = [
        client.query(conceptsSql, [searchText, rowsPerPage, pageNumber]),
        client.query(countSql, [searchText]),
      ];
      const results = await Promise.all(sqlPromises);

      const data = {
        hits: results[0].rows,
        totalHits: results[1] ? parseInt(results[1].rows[0].count) : 0,
      };
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      await client.end();
    }
  }

  async getMultipleExactConcepts(
    searchTexts: number[],
    vocab_file_name: string,
    includeInvalid = true,
  ) {
    const client = getCachedbConnection(this.jwt, this.datasetId);
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
        from ${vocab_file_name}.concept
        WHERE 
        ${searchTextWhereclause}
        ${invalidReasonWhereClause}
        `;

      const result = await client.query(sql, [...searchTexts]);
      const data = {
        hits: result.rows,
        totalHits: result.rowCount,
      };
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      await client.end();
    }
  }

  async getConceptFilterOptionsFaceted(
    vocab_file_name: string,
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

    const client = getCachedbConnection(this.jwt, this.datasetId);
    try {
      const facetPromises = Object.values(facetColumns).map(
        (column: string) => {
          const duckdbFtsBaseQuery = this.getDuckdbFtsBaseQuery(
            vocab_file_name,
            filters,
            [column],
          );
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
          return client.query(sql, [searchText]);
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
      console.log(error);
    } finally {
      await client.end();
    }
  }

  private getDuckdbFtsBaseQuery = (
    duckdb_file_name: string,
    filters: Filters,
    columns: string[] = [],
  ): string => {
    const duckdbFtsWhereClause = this.generateDuckdbFtsWhereClause(filters);

    const columnsToSelect = columns.length === 0 ? '*' : columns.join(', ');

    const duckdbFtsBaseQuery = `
        with fts as ( select ${columnsToSelect}, ${duckdb_file_name}.fts_main_concept.match_bm25( concept_id, $1 ) as score from ${duckdb_file_name}.concept where score is not null ${duckdbFtsWhereClause})`;

    return duckdbFtsBaseQuery;
  };

  private generateDuckdbFtsWhereClause(filters: Filters): string {
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
      return ` AND ${filterList.join(' AND ')}`;
    }
  }

  async getConceptRelationships(
    conceptId: number,
    vocab_file_name: string,
  ): Promise<any> {
    const client = getCachedbConnection(this.jwt, this.datasetId);
    try {
      const sql = `
      select *
          from ${vocab_file_name}.concept_relationship
          WHERE ${INDEX_ATTRIBUTES.concept_relationship.conceptId1}=$1
          `;
      const result = await client.query(sql, [conceptId]);

      const data = {
        hits: result.rows,
        totalHits: result.rowCount,
      };
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      await client.end();
    }
  }

  async getRelationships(
    relationshipId: number,
    vocab_file_name: string,
  ): Promise<any> {
    const client = getCachedbConnection(this.jwt, this.datasetId);
    try {
      const sql = `
      select *
          from ${vocab_file_name}.relationship
          WHERE ${INDEX_ATTRIBUTES.relationship.relationshipId}=$1
          `;
      const result = await client.query(sql, [relationshipId]);
      const data = {
        hits: result.rows,
        totalHits: result.rowCount,
      };
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      await client.end();
    }
  }
}

const getCachedbConnection = (jwt: string, datasetId: string) => {
  try {
    const client = new pg.Client({
      host: env.CACHEDB__HOST,
      port: env.CACHEDB__PORT,
      user: jwt,
      database: `duckdb_${datasetId}`,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000,
    });
    client.connect();
    return client;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
