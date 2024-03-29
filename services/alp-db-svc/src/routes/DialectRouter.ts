import express from "express";
import winston from "winston";
import DBRouter from "./DBRouter";
import DataCharacterizationRouter from "./DataCharacterizationRouter";

class Routes {
  private router: express.Router = express.Router();

  constructor(dialect: string) {
    this.router.use("/", new DBRouter(dialect).router);
    this.router.use(
      "/dataCharacterization",
      new DataCharacterizationRouter(dialect).router
    );
  }

  getRouter = (): express.Router => {
    return this.router;
  };
}

export default Routes;
