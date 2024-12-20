// @ts-types="npm:@types/express"
import { NextFunction, Response, Request } from "express";
import { getRoot, validator } from "../validators/requestValidators.ts";
import { SystemPortalAPI } from "../api/portal-api.ts";
import { JwtPayload, decode } from "jsonwebtoken";

export const getConceptSets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const { body } = validator(req, getRoot);
    const token = req.headers["authorization"] || "";
    const decodedToken = decode(token.replace(/bearer /i, "")) as JwtPayload;
    const userId = decodedToken.sub;
    const systemPortalApi = new SystemPortalAPI(req);
    const conceptSets = await systemPortalApi.getUserConceptSets(userId);
    res.send(conceptSets);
  } catch (e) {
    next(e);
  }
};
