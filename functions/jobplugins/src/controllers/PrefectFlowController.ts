import { Request, Response, Router } from "npm:express";
import { validationResult } from "npm:express-validator";
import { PrefectFlowService } from "../services/PrefectFlowService.ts";

export class PrefectFlowController {
  private prefectFlowService: PrefectFlowService;
  public router = Router();

  constructor() {
    this.registerRoutes();
    this.prefectFlowService = new PrefectFlowService();
    this.prefectFlowService.initialize();
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
        await this.getDatamodels(req, res);
      }
    );
  }

  private async getDatamodels(req: Request, res: Response) {
    try {
      const result = await this.prefectFlowService.getDatamodels();
      res.send(result);
    } catch (error) {
      console.error(`Error getting datamodels: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }
}
