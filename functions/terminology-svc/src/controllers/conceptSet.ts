// @ts-types="npm:@types/express"
import { NextFunction, Response, Request } from "express";
import { getRoot, validator } from "./validators/requestValidators.ts";
import { SystemPortalAPI } from "../api/portal-api.ts";
import { JwtPayload, decode } from "jsonwebtoken";
import { randomUUID } from "crypto";
import * as schemas from "./validators/conceptSetSchemas.ts";
import { CachedbService } from "../services/cachedb.ts";

const getUserIdFromToken = (token: string): string => {
  const decodedToken = decode(token.replace(/bearer /i, "")) as JwtPayload;
  const userId = decodedToken.sub as string;
  return userId;
};

const addOwner = <T>(object: T, isNewEntity = false, userId: string) => {
  const currentDate = new Date().toISOString();

  if (isNewEntity) {
    return {
      ...object,
      createdBy: userId,
      modifiedBy: userId,
      createdDate: currentDate,
      modifiedDate: currentDate,
    };
  }

  return {
    ...object,
    modifiedBy: userId,
    modifiedDate: currentDate,
  };
};

export const getConceptSets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserIdFromToken(req.headers["authorization"]!);
    const systemPortalApi = new SystemPortalAPI(req);
    const conceptSets = await systemPortalApi.getUserConceptSets(userId);
    res.send(conceptSets);
  } catch (e) {
    next(e);
  }
};

export const createConceptSet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body } = schemas.createConceptSet.parse(req);
    const userId = getUserIdFromToken(req.headers["authorization"]!);
    const newConceptSet = addOwner(
      {
        id: randomUUID(),
        ...body,
      },
      true,
      userId
    );

    const systemPortalApi = new SystemPortalAPI(req);
    await systemPortalApi.createConceptSet({
      serviceArtifact: newConceptSet,
    });

    res.send(newConceptSet.id);
  } catch (e) {
    next(e);
  }
};

export const getConceptSet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query, params } = schemas.getConceptSet.parse(req);
    const systemPortalApi = new SystemPortalAPI(req);
    const conceptSet = await systemPortalApi.getConceptSetById(
      params.conceptSetId
    );
    const conceptIds = conceptSet.concepts.map((c) => c.id);
    const cachedbService = new CachedbService(req);
    const concepts = await cachedbService.getConceptsByIds(
      conceptIds,
      query.datasetId
    );
    const conceptSetWithConceptDetails = {
      ...conceptSet,
      concepts: concepts.map((concept) => {
        const conceptFromSet = conceptSet.concepts.find(
          (c) => c.id === concept.conceptId
        );
        return {
          ...concept,
          ...conceptFromSet,
          conceptCode: concept.code,
          conceptName: concept.display,
          vocabularyId: concept.system,
        };
      }),
    };
    res.send(conceptSetWithConceptDetails);
  } catch (e) {
    next(e);
  }
};

export const updateConceptSet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body, params } = schemas.updateConceptSet.parse(req);
    const userId = getUserIdFromToken(req.headers["authorization"]!);
    const updatedConceptSet = addOwner(
      {
        id: params.conceptSetId,
        ...body,
      },
      false,
      userId
    );
    const systemPortalApi = new SystemPortalAPI(req);
    await systemPortalApi.updateConceptSet(updatedConceptSet);
    res.send(updatedConceptSet.id);
  } catch (e) {
    next(e);
  }
};
export const removeConceptSet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { params } = schemas.removeConceptSet.parse(req);
    const systemPortalApi = new SystemPortalAPI(req);
    await systemPortalApi.deleteConceptSet(params.conceptSetId);
    res.send(params.conceptSetId);
  } catch (e) {
    next(e);
  }
};
