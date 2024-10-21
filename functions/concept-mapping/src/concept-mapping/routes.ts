import express, { Request, Response } from "express";
import { validationResult, matchedData } from "express-validator";
import { getCachedbDatabaseFormatProtocolA } from "../../../_shared/alp-base-utils/src/utils";
import {
  getSourceToConceptMappings,
  saveSourceToConceptMappings,
} from "./services";
import { ConceptMappingDto } from "./middleware";
import { env } from "../env";
import { DatabaseOptions } from "../types";

export class ConceptMappingRouter {
  public router = express.Router();
  private readonly logger = console;

  constructor() {
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get(
      "/",
      ConceptMappingDto(),
      async (req: Request, res: Response) => {
        this.logger.log("concept mapping route triggered");

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
        }

        try {
          const user = req.headers["authorization"]!;
          const { datasetId, dialect } = matchedData(req, {
            locations: ["query"],
          });

          const options: DatabaseOptions = {
            host: env.CACHEDB__HOST,
            port: env.CACHEDB__PORT,
            user: user,
            database: getCachedbDatabaseFormatProtocolA(dialect, datasetId),
          };
          await getSourceToConceptMappings(options);
          res.status(200).send("success");
        } catch (error) {
          res.status(500).send(error);
        }
      }
    );
  }
}
