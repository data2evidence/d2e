import { Request, Response, NextFunction } from "express";
/**
 * express middleware to set the dialect on the request parameter based on the baseUrl
 */
export default (req: Request, res: Response, next: NextFunction) => {
  // If request params does not already have a dialect key
  if (!req.params.dialect) {
    // Get dialect from element of request baseUrl
    const dialect = req.originalUrl.split("/")[2];
    req.params.dialect = dialect;
  }
  next();
};
