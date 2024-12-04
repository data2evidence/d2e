import { Router, NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import multer from "multer";
import { validationResult, matchedData } from "express-validator";
import { FilesManagerService } from "./files-manager.service";
import { checkUserDataId } from "../common/middleware/route-check";
import { SaveFileDto } from "./dto/save-file.dto";

const upload = multer({ storage: multer.memoryStorage() });
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
    this.router.get(
      "/:userDataId",
      checkUserDataId,
      async (req: Request, res: Response, next: NextFunction) => {
        const { userDataId } = req.params;

        this.logger.info("Download file by userDataId: ", userDataId);

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

    // username, datakey and the file
    this.router.post(
      "/",
      upload.single("file"),
      SaveFileDto(),
      async (req: Request, res: Response, next: NextFunction) => {
        this.logger.info(`Save file with username and data-key`);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
        }

        try {
          const { username, dataKey } = matchedData(req, {
            locations: ["body"],
          });
          const file: Express.Multer.File = req.file;

          this.filesManagerService.saveFile(username, dataKey, file);
          res.status(200).send("works");
        } catch (err) {
          this.logger.error(`Error when saving file: ${JSON.stringify(err)}`);
        }
      }
    );

    this.router.delete(
      "/:userDataId",
      checkUserDataId,
      async (req: Request, res: Response, next: NextFunction) => {
        const { userDataId } = req.params;

        this.logger.info(`Delete file by userDataId: `, userDataId);

        try {
          res.status(200).send("works");
        } catch (err) {
          this.logger.error(`Error when deleting file: ${JSON.stringify(err)}`);
        }
      }
    );

    this.router.get(
      "/user-data/:userDataId",
      checkUserDataId,
      async (req: Request, res: Response, next: NextFunction) => {
        const { userDataId } = req.params;

        this.logger.info(`get user data by userDataId: `, userDataId);

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
