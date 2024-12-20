// @ts-types="npm:@types/express"
import { NextFunction, Response, Request, Router } from "express";
import { routeMap } from "./openApi/openApi.ts";
import {
  conceptSetController as csc,
  conceptController as cc,
} from "./controllers/index.ts";

const router = Router();

const _routeMap = routeMap;
const errors: string[] = [];

const addRoute = (
  routeId: string,
  controller: (req: Request, res: Response, next: NextFunction) => void
) => {
  const [first, ...rest] = routeId.split(":");
  rest[0] = `/terminology${rest[0]}`;
  const fullRouteId = [first, ...rest].join(":");
  const routeInfo = _routeMap[fullRouteId];

  if (!routeInfo) {
    errors.push(`No route "${fullRouteId}" in OpenApi definition.`);
    return;
  }
  // i.e. $expand needs to be \\$expand for route regex to work
  routeInfo.path = routeInfo.path.replaceAll("$", "\\$");
  router[routeInfo.method](routeInfo.path, controller);
  console.info(`Route "${fullRouteId}" ready.`);
  delete _routeMap[fullRouteId];
};

/****************** START ROUTES ******************/
addRoute("get:/concept/filter-options", cc.getConceptFilterOptions);
addRoute("post:/concept/searchByName", cc.searchConceptByName);
addRoute("post:/concept/searchById", cc.searchConceptById);
addRoute("post:/concept/searchByCode", cc.searchConceptByCode);
addRoute("post:/concept/recommended/list", cc.getRecommendedConcepts);
addRoute("get:/concept/hierarchy", cc.getConceptHierarchy);
// addRoute("post:/concept/getStandardConcepts", csc.getConceptSets);

addRoute("get:/concept-set", csc.getConceptSets);
// addRoute("post:/concept-set", csc.getConceptSets);
// addRoute("get:/concept-set/{conceptSetId}", csc.getConceptSets);
// addRoute("put:/concept-set/{conceptSetId}", csc.getConceptSets);
// addRoute("delete:/concept-set/{conceptSetId}", csc.getConceptSets);
// addRoute("post:/concept-set/included-concepts", csc.getConceptSets);

addRoute(`get:/fhir/4_0_0/valueset/$expand`, cc.getConcepts);
addRoute(
  `get:/fhir/4_0_0/conceptmap/$translate`,
  cc.getTerminologyDetailsWithRelationships
);

/****************** END ROUTES ******************/

const remainingRouteMapKeys = Object.keys(_routeMap);
if (remainingRouteMapKeys.length > 0) {
  errors.push(
    `No implementation found for the following: ${remainingRouteMapKeys.join(
      ", "
    )}`
  );
}

if (errors.length) {
  throw new Error(errors.join("\n"));
}

export { router };
