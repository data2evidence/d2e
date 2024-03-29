import express from "express";
import DialectRouter from "./DialectRouter";
import { DB } from "../utils/config";

class Routes {
  private router: express.Router = express.Router();

  constructor() {
    this.router.use("/hana", new DialectRouter(DB.HANA).getRouter());
    this.router.use("/postgres", new DialectRouter(DB.POSTGRES).getRouter());
  }

  getRouter = (): express.Router => {
    return this.router;
  };
}

export default Routes;
