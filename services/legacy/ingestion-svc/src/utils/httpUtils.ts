import { validationResult } from "express-validator";
import express from "express";
import * as config from "./config";
import { Security } from "./securityUtils";

const logger = config.getLogger();
const securityInstance = new Security(logger)

export enum HTTP_METHOD {
  GET = "get",
  PUT = "put",
  POST = "post",
  DELETE = "delete",
  USE = "use",
}

export enum FlowType {
  ClientCredentials = 'ClientCredentials'
}

export type Role = {
  FLOW_TYPE: string;
  NAME: string;
}

type RoleMap = {
  [uniqueRoleName: string]: Role
}

//The value of "NAME" Attribute below should exactly match with the claim in JWT including the case!
export const Roles: RoleMap = {
  AZURE_AD_INGEST_SVC_BI_DATA: {
    FLOW_TYPE: FlowType.ClientCredentials, 
    NAME: "INGEST_SVC_BI_DATA"
  },
  AZURE_AD_INGEST_SVC_PHDP_DONATIONS: {
    FLOW_TYPE: FlowType.ClientCredentials, 
    NAME: "INGEST_SVC_PHDP_DONATIONS"
  },
  AZURE_AD_INGEST_SVC_RKI_DONATIONS: {
    FLOW_TYPE: FlowType.ClientCredentials, 
    NAME: "INGEST_SVC_RKI_DONATIONS"
  }
}

export function registerRouterHandler(
  router: express.Router,
  httpMethod: HTTP_METHOD,
  urlPath: string,
  dbName: string,
  validators: express.RequestHandler[],
  handlers: express.RequestHandler[],
  roles: Array<Role> = [Roles.AZURE_AD_INGEST_SVC_BI_DATA], //Default role
) {
  const errorHandler = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //Check If there are errors from express validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  };

  /* This method is to extract the necessary roles for a given AD Type based on flow (client credentials / Authz code grant) 
  defined for the endpoint and place it in the request object for subsequent authentication and authorization.
  1. For D4L FRA & MS -> use Authorization code grant flow, check roles from user mgmt api
  2. For Microservice communication -> use client credentials roles from the jwt
  */
  const addRoles = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const filterRolesBasedOnRequestHeader = () => {
        return roles.filter(elem => elem.FLOW_TYPE === FlowType.ClientCredentials)
      }
      (<any>req)._requiredRoles = filterRolesBasedOnRequestHeader()
      next();
    } catch (e) {
      next(e)
    }
  };

  const addRequestProperties = (    
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    if (!dbName) next(new Error("DB Name cannot be empty"));
    (<any>req)._dbName = dbName
    next();
  }

  // Prepend handlers
  if (!handlers) {
    const message = "No handlers passed to register for router";
    logger.error(message);
    throw new Error(message);
  } else {
    handlers.unshift(
      addRoles,
      addRequestProperties,
      securityInstance.ensureAuthenticated,
      securityInstance.ensureAuthorized,
      errorHandler
    );
  }

  router[httpMethod](urlPath, validators, handlers);
}
