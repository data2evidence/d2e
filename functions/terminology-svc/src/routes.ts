// @ts-types="npm:@types/express"
import { NextFunction, Response, Request, Router } from "express";
import { routeMap } from "./openApi.ts";
import { conceptSetController } from "./controllers/index.ts";

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

/****************** START ROUTES ******************/
addRoute("get:/users/{id}", () => {});
addRoute("get:/terminology/concept-set", conceptSetController.getConceptSets);
/****************** END ROUTES ******************/

const remainingRouteMapKeys = Object.keys(_routeMap);
if (remainingRouteMapKeys.length > 0) {
  console.warn(
    `No implementation found for the following: ${remainingRouteMapKeys.join(
      ", "
    )}`
  );
}

export { router };
