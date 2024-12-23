import { Request, Response, Router } from "npm:express";
import { JwtPayload, decode } from "npm:jsonwebtoken";
import { PrefectService } from "../services/PrefectService.ts";

export class PrefectController {
  private prefectService: PrefectService;
  public router = Router();

  constructor() {
    this.registerRoutes();
    this.prefectService = new PrefectService();
  }

  private async createFlowrun(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = this.getToken(req);
      const flowrunId = await this.prefectService.createFlowrun(id, token);
      return res.status(200).send(flowrunId);
    } catch (error) {
      console.log(`createFlowrun: ${error}`);
      return res.status(500).send({ message: "Internal error occurred" });
    }
  }

  private async createAnalysisRun(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = this.getToken(req);
      const flowrunId = await this.prefectService.createAnalysisFlowRun(
        id,
        token
      );
      return res.status(200).send(flowrunId);
    } catch (error) {
      console.log(`createAnalysisRun: ${error}`);
      return res.status(500).send({ message: "Internal error occurred" });
    }
  }

  private async cancelFlowrun(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = this.getToken(req);
      await this.prefectService.cancelFlowRun(id, token);
      return res.status(200).send("Flow run cancelled");
    } catch (error) {
      console.log(`cancelFlowrun: ${error}`);
      return res.status(500).send({ message: "Internal error occurred" });
    }
  }

  private async createTestRun(req: Request, res: Response) {}

  private async getFlowrunLogs(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = this.getToken(req);
      const logs = await this.prefectService.getFlowRunLogs(id, token);
      return res.status(200).send(logs);
    } catch (error) {
      console.log(`getFlowrunLogs: ${error}`);
      return res.status(500).send({ message: "Internal error occurred" });
    }
  }

  private async getFlowrunState(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = this.getToken(req);
      const state = await this.prefectService.getFlowRunState(id, token);
      return res.status(200).send(state);
    } catch (error) {
      console.log(`getFlowrunState: ${error}`);
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
  }

  private getToken(req: Request) {
    return decode(
      req.headers["authorization"].replace(/bearer /i, "")
    ) as JwtPayload;
  }
}
