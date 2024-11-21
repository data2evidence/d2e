import { Router, NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import { FilesManagerService } from "./files-manager.service";
@Service()
export class FilesManagerRouter {
  private readonly router = Router();
  private readonly logger = console;

  constructor(private readonly filesManagerService: FilesManagerService) {
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
        this.logger.info("Download file by userDataId: ");

        try {
          this.filesManagerService.get();
          res.status(200).send("works");
        } catch (err) {
          this.logger.error(
            `Error when downloading file: ${JSON.stringify(err)}`
          );
        }
      }
    );

    this.router.post(
      "/",
      async (_req: Request, res: Response, next: NextFunction) => {
        this.logger.info(`Save file with username and data-key `);

        try {
          res.status(200).send("works");
        } catch (err) {
          this.logger.error(`Error when saving file: ${JSON.stringify(err)}`);
        }
      }
    );

    this.router.delete(
      "/",
      async (_req: Request, res: Response, next: NextFunction) => {
        this.logger.info(`Delete file by userDataId: `);

        try {
          res.status(200).send("works");
        } catch (err) {
          this.logger.error(`Error when deleting file: ${JSON.stringify(err)}`);
        }
      }
    );

    this.router.get(
      "/user-data/:userDataId",
      async (_req: Request, res: Response, next: NextFunction) => {
        this.logger.info(`get user data by userDataId: `);

        try {
          res.status(200).send("works");
        } catch (err) {
          this.logger.error(
            `Error when getting user data: ${JSON.stringify(err)}`
          );
        }
      }
    );
  }
}
