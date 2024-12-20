// @ts-types="npm:@types/express"
import { NextFunction, Response, Request } from "express";
import { getRoot, validator } from "../validators/requestValidators.ts";
import { SystemPortalAPI } from "../api/portal-api.ts";
import { JwtPayload, decode } from "jsonwebtoken";
import { CachedbService } from "../services/cachedb.ts";
import { Filters } from "../types.ts";

export const getConcepts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const offset = req.query.offset as unknown as number;
  const rowsPerPage = req.query.count as unknown as number;
  const datasetId = req.query.datasetId as string;
  const searchText = req.query.code as string;
  const filters = req.query.filters as Filters;
  console.info("Get list of concepts");
  const completeFilters = {
    conceptClassId: filters?.conceptClassId ?? [],
    domainId: filters?.domainId ?? [],
    standardConcept: filters?.standardConcept ?? [],
    vocabularyId: filters?.vocabularyId ?? [],
    validity: filters?.validity ?? [],
  };
  const pageNumber = Math.floor(offset / rowsPerPage);

  try {
    const cachedbService = new CachedbService(req);
    const concepts = await cachedbService.getConcepts(
      pageNumber,
      Number(rowsPerPage),
      datasetId,
      searchText,
      completeFilters
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
  try {
    // TODO: add validator
    const datasetId = req.query.datasetId as string;
    const searchText = req.query.searchText as string;
    const filters = req.query?.filter
      ? JSON.parse(req.query.filter as string)
      : {};

    const conceptClassId = filters.conceptClassId || [];
    const domainId = filters.domainId || [];
    const vocabularyId = filters.vocabularyId || [];
    const standardConcept = filters.standardConcept || [];
    const validity = filters.validity || [];

    const cachedbService = new CachedbService(req);
    const filterOptions = await cachedbService.getConceptFilterOptionsFaceted(
      datasetId,
      searchText,
      {
        conceptClassId,
        domainId,
        vocabularyId,
        standardConcept,
        validity,
      }
    );
    res.send({ filterOptions });
  } catch (e) {
    next(e);
  }
};
