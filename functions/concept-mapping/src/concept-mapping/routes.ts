import express, { Request, Response } from "express";
import pg from "pg";
import { env } from "../env";

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

      const options = {
        host: env.CACHEDB__HOST,
        port: env.CACHEDB__PORT,
        max: 20,
        user: user,
        database: "A|postgresql|a29c196e-4357-4cb9-8a0b-6da85afb0a05",
      };
      const pgclient = new pg.Client(options);
      await pgclient.connect();
      console.log("OK");
      this.logger.log(JSON.stringify(env));
      res.status(200).send("success");
    });
  }
}
