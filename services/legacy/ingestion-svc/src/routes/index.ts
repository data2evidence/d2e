import express from "express";
import winston from "winston";
import PGRouter from "./pgRouter";
import * as config from "../utils/config";

export default class Routes {
  private logger: winston.Logger;
  private router = express.Router();

  constructor() {
    this.logger = config.getLogger()
    this.router.use(
      "/pg",
      new PGRouter().router
    );
  }

  getRouter = () => {
    return this.router
  }
}