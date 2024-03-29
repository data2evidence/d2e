import { Request, Response, NextFunction } from "express";
import { handleCaseByDialect } from "../utils/config";

/**
 * express middleware to set request parameters to upper or lowercase based on dialect(HANA/POSTGRES)
 * HANA will be set to Uppercase
 * POSTGRES will be set to Lowercase
 */

export default (req: Request, res: Response, next: NextFunction) => {
  // Get dialect from 2nd element of request baseurl
  const dialect = req.originalUrl.split("/")[2];

  // Params that will be set to lower or upper case based on dialect
  const paramsToModifyBasedOnDialect = ["schema", "stagingArea"];
  for (const param of paramsToModifyBasedOnDialect) {
    // If dialect is postgres, set param to lowercase, if not set to lowercase
    if (param in req.params) {
      req.params[param] = handleCaseByDialect(dialect, req.params[param]);
    }
  }

  // Query params that will be set to lower or upper case based on dialect
  const queryParamsToModifyBasedOnDialect = ["schema", "sourceSchema"];
  for (const queryParam of queryParamsToModifyBasedOnDialect) {
    // If dialect is postgres, set param to lowercase, if not set to lowercase
    // For "schema" and "sourceschema" which are in query params, it can be either string or array
    if (queryParam in req.query) {
      if (typeof req.query[queryParam] === "string") {
        req.query[queryParam] = handleCaseByDialect(
          dialect,
          req.query[queryParam] as string
        );
      } else {
        (req.query[queryParam] as string[]).map((s: string) =>
          handleCaseByDialect(dialect, s)
        );
      }
    }
  }

  // Params that can be set to uppercase for all dialects
  const paramsToUpperCase = ["studyName"];
  for (const param of paramsToUpperCase) {
    if (param in req.params) {
      req.params[param] = req.params[param].toUpperCase();
    }
  }

  // Params that can be set to lowercase for all dialects
  const paramsToLowerCase = ["dataModel"];
  for (const param of paramsToLowerCase) {
    if (param in req.params) {
      req.params[param] = req.params[param].toLowerCase();
    }
  }
  next();
};
