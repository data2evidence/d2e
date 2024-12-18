// @ts-types="npm:@types/express"
import { NextFunction, Response, Request, Router } from "express";
import { routeMap } from "./openApi.ts";
import { getRoot, validator } from "./requestValidators.ts";

const router = Router();

const _routeMap = routeMap;

const addRoute = (
  routeId: string,
  controller: (req: Request, res: Response, next: NextFunction) => void
) => {
  const routeInfo = _routeMap[routeId];
  if (!routeInfo) {
    throw new Error(`No route "${routeId}" in OpenApi definition.`);
  }
  router[routeInfo.method](routeInfo.path, controller);
  delete _routeMap[routeId];
};

addRoute("get:/users/{id}", () => {});
addRoute("get:/terminology/concept-set", (_req, res, next) => {
  try {
    // const { body } = validator(req, getRoot);
    res.send("Welcome to the Concept Set API!");
  } catch (e) {
    next(e);
  }
});

const remainingRouteMapKeys = Object.keys(_routeMap);
if (remainingRouteMapKeys.length > 0) {
  console.warn(
    `No implementation found for the following: ${remainingRouteMapKeys.join(
      ", "
    )}`
  );
}

export { router };
