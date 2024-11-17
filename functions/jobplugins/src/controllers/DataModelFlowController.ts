import { Request, Response, Router } from "npm:express";
import { validationResult } from "npm:express-validator";
import { DataModelFlowService } from "../services/DataModelFlowService.ts";

export class DataModelFlowController {
  private DataModelFlowService: DataModelFlowService;
  public router = Router();

  constructor() {
    this.registerRoutes();
    this.DataModelFlowService = new DataModelFlowService();
    this.DataModelFlowService.initialize();
  }

  private registerRoutes() {
    // GET /flow/datamodels/list
    this.router.get(
      "/flow/datamodels/list",
      async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
        }
        await this.getDataModels(req, res);
      }
    );
  }

  private async getDataModels(req: Request, res: Response) {
    try {
      const result = await this.DataModelFlowService.getDataModels();
      res.send(result);
    } catch (error) {
      console.error(`Error getting datamodels: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }
}
