// @ts-types="npm:@types/express"
import { NextFunction, Response, Request } from "express";
import { getRoot, validator } from "../requestValidators.ts";
import { SystemPortalAPI } from "../api/portal-api.ts";
import { JwtPayload, decode } from "jsonwebtoken";
import { CachedbService } from "../services/cachedb.ts";

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
    res.send(filterOptions);
  } catch (e) {
    next(e);
  }
};
