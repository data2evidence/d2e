import { Request, Response, Router } from "npm:express";
import { JwtPayload, decode } from "npm:jsonwebtoken";
import { validationResult } from "npm:express-validator";
import { PrefectService } from "../services/PrefectService.ts";
// import { validateCohortGeneratorFlowRunDto } from "../middlewares/CohortValidatorMiddlewares.ts";
// import { CohortService } from "../services/CohortService.ts";

export class PrefectController {
  private prefectService: PrefectService;
  public router = Router();

  constructor() {
    this.registerRoutes();
    this.prefectService = new PrefectService();
  }

  // private async getFlows(req: Request, res: Response) {
  //   try {
  //     // TODO: call `flow` DAO and get flows
  //     const flows = [];
  //     const plugins = flows.map((f) => ({
  //       name: f["name"],
  //       type: f["type"],
  //     }));
  //     res.send(JSON.stringify(plugins));
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send({ error: "Internal Server Error" });
  //   }
  // }

  private async createFlowrun(req, res) {
    try {
      const { id } = req.params;
      const token = this.getToken(req);
      const flowrunId = await this.prefectService.createFlowrun(id, token);
      return res.status(200).send(flowrunId);
    } catch (error) {
      console.log(`Request failed with error: ${error}`);
      return res.status(500).send({ message: "Internal error occurred" });
    }
  }

  private async createAnalysisRun(req, res) {
    try {
      const { id } = req.params;
      const token = this.getToken(req);
      const flowrunId = await this.prefectService.createAnalysisFlowRun(
        id,
        token
      );
      return res.status(200).send(flowrunId);
    } catch (error) {
      return res.status(500).send({ message: "Internal error occurred" });
    }
  }

  private async cancelFlowrun(req, res) {
    try {
      const { id } = req.params;
      const token = this.getToken(req);
      await this.prefectService.cancelFlowRun(id, token);
      return res.status(200).send("Flow run cancelled");
    } catch (error) {
      return res.status(500).send({ message: "Internal error occurred" });
    }
  }

  private async createTestRun(req, res) {}

  private async getFlowrunLogs(req, res) {
    try {
      const { id } = req.params;
      const token = this.getToken(req);
      const logs = await this.prefectService.getFlowRunLogs(id, token);
      return res.status(200).send(logs);
    } catch (error) {
      return res.status(500).send({ message: "Internal error occurred" });
    }
  }

  private async getFlowrunState(req, res) {
    try {
      const { id } = req.params;
      const token = this.getToken(req);
      const state = await this.prefectService.getFlowRunState(id, token);
      return res.status(200).send(state);
    } catch (error) {
      return res.status(500).send({ message: "Internal error occurred" });
    }
  }

  private registerRoutes() {
    this.router.post("/flow-run/:id", this.createFlowrun.bind(this));
    this.router.post("/analysis-run/:id", this.createAnalysisRun.bind(this));
    this.router.post(
      "/flow-run/:id/cancellation",
      this.cancelFlowrun.bind(this)
    );
    this.router.post("/test-run", this.createTestRun.bind(this));

    this.router.get("/flow-run/:id/logs", this.getFlowrunLogs.bind(this));
    this.router.get("/flow-run/:id/state", this.getFlowrunState.bind(this));
    // this.router.get("")
  }

  private getToken(req) {
    return decode(
      req.headers["authorization"].replace(/bearer /i, "")
    ) as JwtPayload;
  }
}
