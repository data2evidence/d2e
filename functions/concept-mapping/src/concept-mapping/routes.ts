import express, { Request, Response } from "express";
import {
  getSourceToConceptMappings,
  saveSourceToConceptMappings,
} from "./services";
import { env } from "../env";
import { DatabaseOptions } from "../types";

export class ConceptMappingRouter {
  public router = express.Router();
  private readonly logger = console;

  constructor() {
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get("/", async (req: Request, res: Response) => {
      this.logger.log("concept mapping route triggered");
      const user = req.headers["authorization"];

      try {
        if (!user) {
          return;
        }
        const options: DatabaseOptions = {
          host: env.CACHEDB__HOST,
          port: env.CACHEDB__PORT,
          user: user,
          database: "A|postgresql|a29c196e-4357-4cb9-8a0b-6da85afb0a05",
        };
        await getSourceToConceptMappings(options);
        res.status(200).send("success");
      } catch (error) {
        res.status(500).send(error);
      }
    });
  }
}
