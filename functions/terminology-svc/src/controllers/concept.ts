// @ts-types="npm:@types/express"
import { NextFunction, Response, Request } from "express";
import { CachedbService } from "../services/cachedb.ts";
import * as schemas from "./validators/conceptSchemas.ts";

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
