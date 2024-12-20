// @ts-types="npm:@types/express"
import { NextFunction, Response, Request } from "express";
import { getRoot, validator } from "./validators/requestValidators.ts";
import { SystemPortalAPI } from "../api/portal-api.ts";
import { JwtPayload, decode } from "jsonwebtoken";
import { CachedbService } from "../services/cachedb.ts";
import { Filters } from "../types.ts";
import { z } from "zod";
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
    const completeFilters = {
      conceptClassId: filter?.conceptClassId ?? [],
      domainId: filter?.domainId ?? [],
      standardConcept: filter?.standardConcept ?? [],
      vocabularyId: filter?.vocabularyId ?? [],
      validity: filter?.validity ?? [],
    };
    const pageNumber = Math.floor(offset / rowsPerPage);

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

export const getTerminologyDetailsWithRelationships = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.info("Get list of concept details and connections");
  try {
    const datasetId = req.query.datasetId as string;
    const conceptId = req.query.conceptId as string;
    const cachedbService = new CachedbService(req);
    const details = await cachedbService.getTerminologyDetailsWithRelationships(
      Number(conceptId),
      datasetId
    );
    res.send(details);
  } catch (e) {
    next(e);
  }
};
