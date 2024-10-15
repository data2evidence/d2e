import { Request, Response, Router } from "npm:express@4.18.2";
import { DqdController } from "../controllers/DqdController.ts";
import { DqdQueryParamsDto } from "../dtos/DqdQueryParams.dto.ts";

export class DqdRouter {
  constructor() {
    this.registerRoutes();
  }
  public router = Router();
  private dqdController = new DqdController();
  private registerRoutes() {
    // GET /data-quality/flow-run/:flowRunId/results
    this.router.get(
      "/data-quality/flow-run/:flowRunId/results",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
          await this.dqdController.getDataQualityResults(req, res);
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    );

    // GET /data-quality/flow-run/:flowRunId/overview
    this.router.get(
      "/data-quality/flow-run/:flowRunId/overview",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
          await this.dqdController.getDataQualityOverview(req, res);
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    );

    // GET /data-quality/dataset/:datasetId/flow-run/latest
    this.router.get(
      "/data-quality/dataset/:datasetId/flow-run/latest",
      (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
          this.dqdController.getLatestFlowRunWithoutCohort(req, res);
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    );

    // GET /latest-flow-run-with-cohort/:datasetId/:cohortDefinitionId
    this.router.get(
      "/data-quality/dataset/:datasetId/cohort/:cohortDefinitionId/flow-run/latest",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
          await this.dqdController.getLatestFlowRunWithCohort(req, res);
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    );

    // GET /flow-run-by-release/:datasetId/:releaseId
    this.router.get(
      "/data-quality/dataset/:datasetId/release/:releaseId/flow-run",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
          await this.dqdController.getFlowRunByReleaseId(req, res);
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    );

    // POST /data-quality/flow-run
    this.router.post(
      "/data-quality/flow-run",

      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params, req.body);
          dto.validateRequestBody();
          await this.dqdController.createDataQualityFlowRun(req, res);
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    );
    // GET /data-quality/dataset/:datasetId/category/history
    this.router.get(
      "/data-quality/dataset/:datasetId/category/history",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
          await this.dqdController.getDataQualityHistoryByCategory(req, res);
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    );

    // GET /data-quality/dataset/:datasetId/history
    this.router.get(
      "/data-quality/dataset/:datasetId/history",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
          await this.dqdController.getDataQualityHistory(req, res);
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    );

    // GET /data-quality/dataset/:datasetId/domain/history
    this.router.get(
      "/data-quality/dataset/:datasetId/domain/history",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
          await this.dqdController.getDataQualityHistoryByDomain(req, res);
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    );
    // GET /data-quality/dataset/:datasetId/history
    this.router.get(
      "/data-quality/dataset/:datasetId/history",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
          await this.dqdController.getDataQualityHistory(req, res);
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    );

    // GET /data-quality/dataset/:datasetId/domain/continuity
    this.router.get(
      "/data-quality/dataset/:datasetId/domain/continuity",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
          await this.dqdController.getDatasetDomainContinuity(req, res);
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
    );
  }
}
