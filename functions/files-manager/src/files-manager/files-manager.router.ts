import { Router, NextFunction, Request, Response } from "express";
import { Service } from "typedi";

@Service()
export class FilesManagerRouter {
  private readonly router = Router();
  private readonly logger = console;

  constructor() {
    this.registerRoutes();
  }

  getRouter() {
    return this.router;
  }

  private registerRoutes() {
    // reference datacontroller here
    this.router.get(
      "/",
      async (_req: Request, res: Response, next: NextFunction) => {
        res.status(200).send("works");
      }
    );
  }
}
