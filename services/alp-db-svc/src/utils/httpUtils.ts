import { validationResult } from "express-validator";
import express from "express";

import * as config from "./config";
import ReqParamCaseMiddleware from "../middleware/ReqParamCaseMiddleware";
import ReqParamDialectSetterMiddleware from "../middleware/ReqParamDialectSetterMiddleware";
import AddUserObjToReq from "../middleware/AddUserObjToReq";

const logger = config.getLogger();

export enum HTTP_METHOD {
  GET = "get",
  PUT = "put",
  POST = "post",
  DELETE = "delete",
  USE = "use",
}
export function registerRouterHandler(
  router: express.Router,
  httpMethod: HTTP_METHOD,
  urlPath: string,
  validators: express.RequestHandler[],
  handlers: express.RequestHandler[]
) {
  const errorHandler = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //Check if there are errors from express validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new Error(JSON.stringify(errors)));
    } else {
      next();
    }
  };

  // Prepend handlers
  if (!handlers) {
    const message = "No handlers passed to register for router";
    logger.error(message);
    throw new Error(message);
  } else {
    handlers.unshift(AddUserObjToReq, ReqParamCaseMiddleware, errorHandler);
  }

  // ReqParamDialectSetterMiddleware is added here because it has to run first before the validators
  router[httpMethod](
    urlPath,
    ReqParamDialectSetterMiddleware,
    validators,
    handlers
  );
}
