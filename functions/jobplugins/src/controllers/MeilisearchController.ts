import { Request, Response, Router } from "npm:express";
import { validationResult } from "npm:express-validator";
import { validateMeilisearchAddIndexFlowRunDto } from "../middlewares/MeilisearchValidatorMiddlewares.ts";
import { MeilisearchService } from "../services/MeilisearchService.ts";

export class MeilisearchController {
  private meilisearchService: MeilisearchService;
  public router = Router();

  constructor() {
    this.registerRoutes();
    this.meilisearchService = new MeilisearchService();
  }

  private registerRoutes() {
    // POST /meilisearch/index/flow-run
    this.router.post(
      "/index/flow-run",
      validateMeilisearchAddIndexFlowRunDto(),
      async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
        }
        await this.createAddIndexFlowRun(req, res);
      }
    );
  }

  private async createAddIndexFlowRun(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;
      const meilisearchFlowRunDto = req.body;
      const result = await this.meilisearchService.createAddIndexFlowRun(
        meilisearchFlowRunDto,
        token
      );
      res.send(result);
    } catch (error) {
      console.error(`Error creating meilisearch index flow run: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }
}
