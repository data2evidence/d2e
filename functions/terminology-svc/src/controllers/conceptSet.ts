// @ts-types="npm:@types/express"
import { NextFunction, Response, Request } from "express";
import { getRoot, validator } from "./validators/requestValidators.ts";
import { SystemPortalAPI } from "../api/portal-api.ts";
import { JwtPayload, decode } from "jsonwebtoken";
import { randomUUID } from "crypto";
import * as schemas from "./validators/conceptSetSchemas.ts";

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
        ...body,
        id: randomUUID(),
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
