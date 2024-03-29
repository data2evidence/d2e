//Imports
import http from "http";
import https from "https";
import express from "express";
import winston from "winston";
import { createTerminus } from "@godaddy/terminus";
import { utils as baseUtils } from "@alp/alp-base-utils";

require("dotenv").config({ debug: process.env.DB_SVC__DEBUG });

import Routes from "./routes";
import * as config from "./utils/config";
import * as utils from "./utils/baseUtils";

class App {
  private app: express.Application;
  private port: number;
  private logger: winston.Logger;
  private disableSSL: boolean;

  constructor() {
    this.app = express();
    this.port = config.getProperties()["alp_db_http_port"] || 3333;
    this.logger = config.getLogger();
    this.disableSSL = utils.getBoolean(process.env.DISABLE_SSL);
    this.initializeMiddlewares();
    this.initializeEntryPoint();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeEntryPoint() {
    //This is only for Main entry point. Please add other the routes in the Routes constructor of routes/index.ts
    this.app.use(
      config.getProperties()["alp_db_base_path"] || "/",
      new Routes().getRouter()
    );

    baseUtils.setupGlobalErrorHandling(this.app, this.logger);

    //404
    this.app.use((req: express.Request, res: express.Response) => {
      const err = `Unable to find the requested resource: ${
        req.protocol
      }://${req.get("host")}${req.originalUrl}`;
      this.logger.error(err);
      res.status(404).json({ message: err });
    });
  }

  public start() {
    let server: http.Server;

    if (this.disableSSL) {
      server = http.createServer(this.app);
    } else {
      server = https.createServer(
        {
          key: config.getProperties()["ssl_private_key"],
          cert: config.getProperties()["ssl_public_key"],
        },
        this.app
      );
    }

    createTerminus(
      server,
      config.getTerminusOptions(
        this.logger,
        config.getProperties()["alp_db_base_path"]
      )
    );
    server.listen(this.port);
    utils.enablePasswordMask();
    this.startUpMessage();
  }

  public getConfiguredApp = () => {
    utils.enablePasswordMask();
    return this.app;
  };

  private startUpMessage = () => {
    this.logger.log("info", `************************************`);
    this.logger.log("info", `Server is listening on port ${this.port}`);
    this.logger.log("info", `************************************`);
  };
}

if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "script") {
  module.exports = new App().getConfiguredApp();
} else {
  new App().start();
}
