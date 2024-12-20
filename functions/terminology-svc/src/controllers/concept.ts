// @ts-types="npm:@types/express"
import { NextFunction, Response, Request } from "express";
import { CachedbService } from "../services/cachedb.ts";
import * as schemas from "./validators/conceptSchemas.ts";
import {
  ConceptHierarchyEdge,
  ConceptHierarchyNodeLevel,
  ConceptHierarchyNode,
} from "../types.ts";

export const getConcepts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.info("Get list of concepts");
  try {
    const {
      query: {
        offset,
        count: rowsPerPage,
        datasetId,
        code: searchText,
        filter,
      },
    } = schemas.getConcepts.parse(req);

    const pageNumber = Math.floor(offset / rowsPerPage);

    const cachedbService = new CachedbService(req);
    const concepts = await cachedbService.getConcepts(
      pageNumber,
      Number(rowsPerPage),
      datasetId,
      searchText,
      filter
    );
    res.send(concepts);
  } catch (e) {
    console.error(JSON.stringify(e));
    next(e);
  }
};

export const searchConceptByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.info("Get concept by name");
  try {
    const {
      body: { datasetId, conceptName },
    } = schemas.searchConceptByName.parse(req);

    const cachedbService = new CachedbService(req);
    const concepts = await cachedbService.getExactConcept(
      conceptName,
      datasetId,
      "concept_name"
    );
    res.send(concepts);
  } catch (e) {
    console.error(JSON.stringify(e));
    next(e);
  }
};

export const searchConceptById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.info("Get concept by id");
  try {
    const {
      body: { datasetId, conceptId },
    } = schemas.searchConceptById.parse(req);

    const cachedbService = new CachedbService(req);
    const concepts = await cachedbService.getExactConcept(
      conceptId,
      datasetId,
      "concept_id"
    );
    res.send(concepts);
  } catch (e) {
    console.error(JSON.stringify(e));
    next(e);
  }
};

export const searchConceptByCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.info("Get concept by code");
  try {
    const {
      body: { datasetId, conceptCode },
    } = schemas.searchConceptByCode.parse(req);

    const cachedbService = new CachedbService(req);
    const concepts = await cachedbService.getExactConcept(
      conceptCode,
      datasetId,
      "concept_code"
    );
    res.send(concepts);
  } catch (e) {
    console.error(JSON.stringify(e));
    next(e);
  }
};

export const getRecommendedConcepts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.info("Get concept by code");
  try {
    const {
      body: { datasetId, conceptIds },
    } = schemas.getRecommendedConcepts.parse(req);

    const cachedbService = new CachedbService(req);
    const concepts = await cachedbService.getRecommendedConcepts(
      conceptIds,
      datasetId
    );
    res.send(concepts);
  } catch (e) {
    console.error(JSON.stringify(e));
    next(e);
  }
};

export const getConceptFilterOptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.info("Get concept filter options");
  try {
    const {
      query: { datasetId, searchText, filter },
    } = schemas.getConceptFilterOptions.parse(req);

    const cachedbService = new CachedbService(req);
    const filterOptions = await cachedbService.getConceptFilterOptionsFaceted(
      datasetId,
      searchText,
      filter
    );
    res.send({ filterOptions });
  } catch (e) {
    next(e);
  }
};

export const getTerminologyDetailsWithRelationships = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.info("Get list of concept details and connections");
  try {
    const {
      query: { datasetId, conceptId },
    } = schemas.getTerminologyDetailsWithRelationships.parse(req);
    const cachedbService = new CachedbService(req);
    const details = await cachedbService.getTerminologyDetailsWithRelationships(
      conceptId,
      datasetId
    );
    res.send(details);
  } catch (e) {
    next(e);
  }
};

export const getConceptHierarchy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      query: { datasetId, conceptId, depth },
    } = schemas.getConceptHierarchy.parse(req);
    const edges: ConceptHierarchyEdge[] = [];
    const nodeLevels: ConceptHierarchyNodeLevel[] = [];
    const conceptIds: Set<number> = new Set<number>().add(conceptId);
    nodeLevels.push({ conceptId: conceptId, level: 0 });

    const cachedbService = new CachedbService(req);
    const conceptDescendants = await cachedbService.getDescendants(
      [conceptId],
      datasetId
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
      maxDepth: number
    ) => {
      const conceptAncestors = await cachedbService.getAncestors(
        [conceptId],
        datasetId,
        1
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
            maxDepth
          );
        }
      });
    };

    await getAllAncestors(conceptId, depth, depth);

    const concepts = await cachedbService.getConceptsByIds(
      Array.from(conceptIds),
      datasetId
    );

    const nodes: ConceptHierarchyNode[] = nodeLevels.reduce(
      (acc: ConceptHierarchyNode[], current: ConceptHierarchyNodeLevel) => {
        const conceptNode = concepts.find(
          (concept) => concept.conceptId === current.conceptId
        );
        acc.push({
          conceptId: current.conceptId,
          display: conceptNode?.display ?? "",
          level: current.level,
        });
        return acc;
      },
      []
    );

    res.send({ edges, nodes });
  } catch (e) {
    next(e);
  }
};
