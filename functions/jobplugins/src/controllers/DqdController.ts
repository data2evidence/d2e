import { Request, Response, Router } from "npm:express@4.18.2";
import { DqdQueryParamsDto } from "../dtos/DqdQueryParams.dto.ts";
import { DqdService } from "../services/DqdService.ts";

export class DqdController {
  private dqdService: DqdService;
  public router = Router();

  constructor() {
    this.registerRoutes();
    this.dqdService = new DqdService();
  }

  private registerRoutes() {
    // GET /data-quality/flow-run/:flowRunId/results
    this.router.get(
      "/data-quality/flow-run/:flowRunId/results",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
        } catch (error) {
          res.status(400).send(error.message);
        }
        await this.getDataQualityResults(req, res);
      }
    );

    // GET /data-quality/flow-run/:flowRunId/overview
    this.router.get(
      "/data-quality/flow-run/:flowRunId/overview",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
        } catch (error) {
          res.status(400).send(error.message);
        }
        await this.getDataQualityOverview(req, res);
      }
    );

    // GET /data-quality/dataset/:datasetId/flow-run/latest
    this.router.get(
      "/data-quality/dataset/:datasetId/flow-run/latest",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
        } catch (error) {
          res.status(400).send(error.message);
        }
        await this.getLatestFlowRunWithoutCohort(req, res);
      }
    );

    // GET /latest-flow-run-with-cohort/:datasetId/:cohortDefinitionId
    this.router.get(
      "/data-quality/dataset/:datasetId/cohort/:cohortDefinitionId/flow-run/latest",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
        } catch (error) {
          res.status(400).send(error.message);
        }
        await this.getLatestFlowRunWithCohort(req, res);
      }
    );

    // GET /flow-run-by-release/:datasetId/:releaseId
    this.router.get(
      "/data-quality/dataset/:datasetId/release/:releaseId/flow-run",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
        } catch (error) {
          res.status(400).send(error.message);
        }
        await this.getFlowRunByReleaseId(req, res);
      }
    );

    // POST /data-quality/flow-run
    this.router.post(
      "/data-quality/flow-run",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params, req.body);
          dto.validateRequestBody();
        } catch (error) {
          res.status(400).send(error.message);
        }
        await this.createDataQualityFlowRun(req, res);
      }
    );
    // GET /data-quality/dataset/:datasetId/category/history
    this.router.get(
      "/data-quality/dataset/:datasetId/category/history",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
        } catch (error) {
          res.status(400).send(error.message);
        }
        await this.getDataQualityHistoryByCategory(req, res);
      }
    );

    // GET /data-quality/dataset/:datasetId/history
    this.router.get(
      "/data-quality/dataset/:datasetId/history",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
        } catch (error) {
          res.status(400).send(error.message);
        }
        await this.getDataQualityHistory(req, res);
      }
    );

    // GET /data-quality/dataset/:datasetId/domain/history
    this.router.get(
      "/data-quality/dataset/:datasetId/domain/history",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
        } catch (error) {
          res.status(400).send(error.message);
        }
        await this.getDataQualityHistoryByDomain(req, res);
      }
    );
    // GET /data-quality/dataset/:datasetId/history
    this.router.get(
      "/data-quality/dataset/:datasetId/history",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
        } catch (error) {
          res.status(400).send(error.message);
        }
        await this.getDataQualityHistory(req, res);
      }
    );

    // GET /data-quality/dataset/:datasetId/domain/continuity
    this.router.get(
      "/data-quality/dataset/:datasetId/domain/continuity",
      async (req: Request, res: Response) => {
        try {
          const dto = new DqdQueryParamsDto(req.params);
          dto.validateParams();
        } catch (error) {
          res.status(400).send(error.message);
        }
        await this.getDatasetDomainContinuity(req, res);
      }
    );
  }

  private async getDataQualityResults(req: Request, res: Response) {
    try {
      const flowRunId = req.params.flowRunId;
      const token = req.headers.authorization!;
      const dqdResult = await this.dqdService.getDataQualityResult(
        flowRunId,
        token
      );

      if (dqdResult) {
        res.send(dqdResult);
      } else {
        res.status(404).send(`No DQD result found for flowRunId: ${flowRunId}`);
      }
    } catch (error) {
      console.error(`Error retrieving DQD result: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }

  private async getDataQualityOverview(req: Request, res: Response) {
    try {
      const flowRunId = req.params.flowRunId;
      const token = req.headers.authorization!;
      const overview = await this.dqdService.getDataQualityOverview(
        flowRunId,
        token
      );

      if (overview) {
        res.send(overview);
      } else {
        res.status(404).send(`No overview found for flowRunId: ${flowRunId}`);
      }
    } catch (error) {
      console.error(`Error retrieving DQD overview: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }

  private async getLatestFlowRunWithoutCohort(req: Request, res: Response) {
    try {
      const datasetId = req.params.datasetId;
      const token = req.headers.authorization!;
      const flowRun = await this.dqdService.getLatestFlowRunWithoutCohort(
        datasetId,
        token
      );

      if (flowRun) {
        res.send(flowRun);
      } else {
        res.status(404).send(`No flow run found for datasetId: ${datasetId}`);
      }
    } catch (error) {
      console.error(`Error retrieving latest flow run: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }

  private async getLatestFlowRunWithCohort(req: Request, res: Response) {
    try {
      const datasetId = req.params.datasetId;
      const cohortDefinitionId = req.params.cohortDefinitionId;
      const token = req.headers.authorization!;
      const flowRun = await this.dqdService.getLatestFlowRunWithCohort(
        datasetId,
        cohortDefinitionId,
        token
      );

      if (flowRun) {
        res.send(flowRun);
      } else {
        res
          .status(404)
          .send(
            `No flow run found for datasetId: ${datasetId}, cohortDefinitionId: ${cohortDefinitionId}`
          );
      }
    } catch (error) {
      console.error(`Error retrieving latest flow run with cohort: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }

  private async getFlowRunByReleaseId(req: Request, res: Response) {
    try {
      const datasetId = req.params.datasetId;
      const releaseId = req.params.releaseId;
      const token = req.headers.authorization!;
      const flowRun = await this.dqdService.getFlowRunByReleaseId(
        datasetId,
        releaseId,
        token
      );

      if (flowRun) {
        res.send(flowRun);
      } else {
        res
          .status(404)
          .send(
            `No flow run found for datasetId: ${datasetId}, releaseId: ${releaseId}`
          );
      }
    } catch (error) {
      console.error(`Error retrieving flow run by release: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }

  private async createDataQualityFlowRun(req: Request, res: Response) {
    try {
      const token = req.headers.authorization!;
      const dataQualityFlowRunDto = req.body;
      const result = await this.dqdService.createDataQualityFlowRun(
        dataQualityFlowRunDto,
        token
      );
      res.send(result);
    } catch (error) {
      console.error(`Error creating DQD flow run: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }

  private async getDataQualityHistoryByCategory(req: Request, res: Response) {
    try {
      const datasetId = req.params.datasetId;
      const token = req.headers.authorization!;
      const history = await this.dqdService.getDataQualityHistoryByCategory(
        datasetId,
        token
      );
      res.send(history);
    } catch (error) {
      console.error(`Error retrieving dataset history by category: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }

  private async getDataQualityHistory(req: Request, res: Response) {
    try {
      const datasetId = req.params.datasetId;
      const token = req.headers.authorization!;
      const history = await this.dqdService.getDataQualityHistory(
        datasetId,
        token
      );
      res.send(history);
    } catch (error) {
      console.error(`Error retrieving dataset history: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }

  private async getDataQualityHistoryByDomain(req: Request, res: Response) {
    try {
      const datasetId = req.params.datasetId;
      const token = req.headers.authorization!;
      const history = await this.dqdService.getDataQualityHistoryByDomain(
        datasetId,
        token
      );
      res.send(history);
    } catch (error) {
      console.error(`Error retrieving dataset history: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }

  private async getDatasetDomainContinuity(req: Request, res: Response) {
    try {
      const datasetId = req.params.datasetId;
      const token = req.headers.authorization!;
      const history = await this.dqdService.getDatasetDomainContinuity(
        datasetId,
        token
      );
      res.send(history);
    } catch (error) {
      console.error(`Error retrieving dataset history: ${error}`);
      res.status(500).send(`Error occurs: ${error}`);
    }
  }
}
