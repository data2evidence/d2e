// @ts-types="npm:@types/express"
import { Request } from "express";
import {
  IDuckdbConcept,
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
  IDuckdbFacet,
} from "../types.ts";
// import { groupBy } from "../utils/helperUtil.ts";
import { CachedbDAO } from "./cachedb-dao.ts";
import { SystemPortalAPI } from "../api/portal-api.ts";
import { groupBy } from "../utils/helperUtil.ts";

export class CachedbService {
  private readonly token: string;
  private readonly systemPortalApi: SystemPortalAPI;

  constructor(request: Request) {
    this.systemPortalApi = new SystemPortalAPI(request);
    // TODO: remove default string
    this.token = request.headers["authorization"] || "";
  }

  private async getVocabSchemaName(datasetId: string) {
    const { vocabSchemaName } = await this.systemPortalApi.getDatasetDetails(
      datasetId
    );
    return vocabSchemaName;
  }

  async getConcepts(
    pageNumber = 0,
    rowsPerPage: number,
    datasetId: string,
    searchText = "",
    filters: Filters
  ) {
    try {
      const vocabSchemaName = await this.getVocabSchemaName(datasetId);
      const cachedbDao = new CachedbDAO(this.token, datasetId, vocabSchemaName);
      const result = await cachedbDao.getConcepts(
        pageNumber,
        Number(rowsPerPage),
        searchText,
        filters
      );
      return this.duckdbResultMapping(result);
    } catch (err) {
      console.error(err);
    }
  }

  async getExactConcept(
    conceptName: string | number,
    datasetId: string,
    conceptColumnName: "concept_name" | "concept_id" | "concept_code"
  ) {
    try {
      const vocabSchemaName = await this.getVocabSchemaName(datasetId);
      const cachedbDao = new CachedbDAO(this.token, datasetId, vocabSchemaName);
      const result = await cachedbDao.getExactConcept(
        conceptName,
        conceptColumnName
      );
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getConceptFilterOptionsFaceted(
    datasetId: string,
    searchText: string,
    filters: Filters
  ): Promise<IDuckdbFacet> {
    const vocabSchemaName = await this.getVocabSchemaName(datasetId);
    const cachedbDao = new CachedbDAO(this.token, datasetId, vocabSchemaName);
    return cachedbDao.getConceptFilterOptionsFaceted(searchText, filters);
  }

  async getTerminologyDetailsWithRelationships(
    conceptId: number,
    datasetId: string
  ) {
    console.info("Get list of concept details and connections");
    const defaultValue: FhirConceptMap = {
      resourceType: FhirResourceType.conceptmap,
      group: [],
    };
    try {
      const searchConcepts1: number[] = [conceptId];

      const vocabSchemaName = await this.getVocabSchemaName(datasetId);
      const cachedbDao = new CachedbDAO(this.token, datasetId, vocabSchemaName);
      const DuckdbResultConcept1 = await cachedbDao.getMultipleExactConcepts(
        searchConcepts1,
        true
      );
      if (!DuckdbResultConcept1) {
        return defaultValue;
      }

      const conceptC1: FhirValueSet =
        this.duckdbResultMapping(DuckdbResultConcept1);
      if (!conceptC1.expansion.contains) {
        return defaultValue;
      }
      const groups: FhirConceptMapGroup[] = [];

      if (conceptC1.expansion.contains.length > 0) {
        const detailsC1: FhirValueSetExpansionContainsWithExt =
          conceptC1.expansion.contains[0];
        const fhirTargetElements: FhirConceptMapElementTarget[] = [];
        const conceptRelations = await cachedbDao.getConceptRelationships(
          detailsC1.conceptId
        );

        for (let i = 0; i < conceptRelations.hits.length; i++) {
          const relationships = await cachedbDao.getRelationships(
            conceptRelations.hits[i].relationship_id
          );
          const searchConcepts2: number[] = [
            conceptRelations.hits[i].concept_id_2,
          ];
          const DuckdbResultConcept2 =
            await cachedbDao.getMultipleExactConcepts(searchConcepts2, true);
          if (!DuckdbResultConcept2) {
            continue;
          }
          const conceptC2: FhirValueSet =
            this.duckdbResultMapping(DuckdbResultConcept2);

          if (!conceptC2.expansion.contains) {
            continue;
          }
          const detailsC2: FhirValueSetExpansionContainsWithExt =
            conceptC2.expansion.contains[0];
          if (!detailsC2) {
            continue;
          }
          const searchConcepts3: number[] = [
            relationships.hits[0].relationship_concept_id,
          ];
          const DuckdbResultConcept3 =
            await cachedbDao.getMultipleExactConcepts(searchConcepts3, true);
          if (!DuckdbResultConcept3) {
            continue;
          }
          const conceptC3: FhirValueSet =
            this.duckdbResultMapping(DuckdbResultConcept3);

          if (!conceptC3.expansion.contains) {
            continue;
          }
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
          "vocabularyId"
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
      console.info("Return concept details and connections");
      return conceptMap_ext;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  //   async getRecommendedConcepts(conceptIds: number[], datasetId: string) {
  //     try {
  //       const vocabSchemaName = await this.getVocabSchemaName(datasetId);
  //       const cachedbDao = new CachedbDAO(this.token, datasetId, vocabSchemaName);
  //       const recommendedConcepts = await cachedbDao.getExactConceptRecommended(
  //         conceptIds
  //       );

  //       if (recommendedConcepts.length === 0) {
  //         return [];
  //       }

  //       const mappedConceptIds = recommendedConcepts.map((e) => e.concept_id_2);

  //       const duckdbResult = await cachedbDao.getMultipleExactConcepts(
  //         mappedConceptIds
  //       );

  //       if (duckdbResult === null) {
  //         return [];
  //       }

  //       const mappedResult =
  //         this.duckdbResultMapping(duckdbResult).expansion.contains[0];
  //       // Result has to be mapped like this due to expected response from frontend
  //       const mappedResult2 = [
  //         {
  //           ...mappedResult,
  //           conceptCode: mappedResult.code,
  //           conceptName: mappedResult.display,
  //           vocabularyId: mappedResult.system,
  //         },
  //       ];
  //       return mappedResult2;
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }

  //   async getDescendants(conceptIds: number[], datasetId: string) {
  //     if (conceptIds.length === 0) {
  //       return [];
  //     }
  //     const vocabSchemaName = await this.getVocabSchemaName(datasetId);
  //     const cachedbDao = new CachedbDAO(this.token, datasetId, vocabSchemaName);
  //     const result = await cachedbDao.getExactConceptDescendants(conceptIds);
  //     return result;
  //   }

  //   async getAncestors(conceptIds: number[], datasetId: string, depth: number) {
  //     if (conceptIds.length === 0) {
  //       return [];
  //     }
  //     const vocabSchemaName = await this.getVocabSchemaName(datasetId);
  //     const cachedbDao = new CachedbDAO(this.token, datasetId, vocabSchemaName);
  //     const result = await cachedbDao.getExactConceptAncestors(conceptIds, depth);
  //     return result;
  //   }

  //   async getConceptsByIds(conceptIds: number[], datasetId: string) {
  //     if (conceptIds.length === 0) {
  //       return [];
  //     }
  //     const vocabSchemaName = await this.getVocabSchemaName(datasetId);
  //     const cachedbDao = new CachedbDAO(this.token, datasetId, vocabSchemaName);
  //     const result = await cachedbDao.getMultipleExactConcepts(conceptIds);
  //     return this.duckdbResultMapping(result).expansion.contains;
  //   }

  //   async getConceptRelationshipMapsTo(conceptIds: number[], datasetId: string) {
  //     if (conceptIds.length === 0) {
  //       return [];
  //     }
  //     const vocabSchemaName = await this.getVocabSchemaName(datasetId);
  //     const cachedbDao = new CachedbDAO(this.token, datasetId, vocabSchemaName);
  //     const result = await cachedbDao.getConceptRelationship(
  //       conceptIds,
  //       "Maps to"
  //     );
  //     return result;
  //   }

  //   async getConceptsAndDescendantIds(
  //     conceptIds: number[],
  //     descendantIds: number[],
  //     datasetId: string
  //   ): Promise<number[]> {
  //     if (!conceptIds.length) {
  //       return [];
  //     }
  //     const conceptsAndDescendantIds: number[] = [];

  //     const vocabSchemaName = await this.getVocabSchemaName(datasetId);
  //     const cachedbDao = new CachedbDAO(this.token, datasetId, vocabSchemaName);

  //     // Ensures included concept IDs are present in vocab schema and valid
  //     const validConcepts = await cachedbDao.getMultipleExactConcepts(
  //       conceptIds,
  //       false
  //     );
  //     validConcepts.hits.forEach((concept) => {
  //       conceptsAndDescendantIds.push(concept.concept_id);
  //     });

  //     if (!descendantIds.length) {
  //       return conceptsAndDescendantIds;
  //     }

  //     const conceptDescendants = await cachedbDao.getExactConceptDescendants(
  //       descendantIds
  //     );
  //     conceptDescendants.forEach((concept) => {
  //       conceptsAndDescendantIds.push(concept.descendant_concept_id);
  //     });
  //     return conceptsAndDescendantIds;
  //   }

  private mapConceptWithFhirValueSetExpansionContains(item: IConcept) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // valid_end_date is in seconds while js timestamp is in ms
    const validity =
      (item.valid_end_date || -1) > Number(new Date()) / 1000
        ? "Valid"
        : "Invalid";

    const details: FhirValueSetExpansionContainsWithExt = {
      conceptId: item.concept_id,
      display: item.concept_name,
      domainId: item.domain_id,
      system: item.vocabulary_id,
      conceptClassId: item.concept_class_id,
      standardConcept: item.standard_concept,
      concept:
        item.standard_concept == null || item.standard_concept !== "S"
          ? "Non-standard"
          : "Standard",
      code: item.concept_code,
      // The date is stored as seconds from epoch, but new Date() expects ms
      validStartDate: item.valid_start_date
        ? new Date(item.valid_start_date * 1000).toISOString()
        : new Date(0).toISOString(),
      validEndDate: item.valid_end_date
        ? new Date(item.valid_end_date * 1000).toISOString()
        : "",
      validity,
    };
    return details;
  }

  private duckdbResultMapping(DuckdbResult: IDuckdbConcept): FhirValueSet {
    const valueSetExpansionContains = DuckdbResult.hits.map((data) => {
      return this.mapConceptWithFhirValueSetExpansionContains(data);
    });

    const valueSetExpansion: FhirValueSetExpansion = {
      total: DuckdbResult.hits.length > 0 ? DuckdbResult.totalHits : 0,
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
