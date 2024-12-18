// @ts-types="npm:@types/express"
import { NextFunction, Response, Request } from "express";
import { getRoot, validator } from "../requestValidators.ts";

export const getConceptSets = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const { body } = validator(req, getRoot);
    res.send("Welcome to the Concept Set API!");
  } catch (e) {
    next(e);
  }
};
