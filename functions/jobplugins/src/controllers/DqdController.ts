import { Request, Response } from "npm:express@4.18.2";
import { DqdService } from "../services/DqdService.ts";

export class DqdController {
  private dqdService: DqdService;

  constructor() {
    this.dqdService = new DqdService();
  }

  public async getDataQualityResults(req: Request, res: Response) {
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

  public async getDataQualityOverview(req: Request, res: Response) {
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

  public async getLatestFlowRunWithoutCohort(req: Request, res: Response) {
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

  public async getLatestFlowRunWithCohort(req: Request, res: Response) {
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

  public async getFlowRunByReleaseId(req: Request, res: Response) {
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

  public async createDataQualityFlowRun(req: Request, res: Response) {
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

  public async getDataQualityHistoryByCategory(req: Request, res: Response) {
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

  public async getDataQualityHistory(req: Request, res: Response) {
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

  public async getDataQualityHistoryByDomain(req: Request, res: Response) {
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

  public async getDatasetDomainContinuity(req: Request, res: Response) {
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
