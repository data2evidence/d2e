import express, { Request, Response } from "npm:express@4.18.2";
import { PortalServerAPI } from "../api/PortalServerAPI.ts";
import { PrefectAPI } from "../api/PrefectAPI.ts";
import { PrefectTagNames } from "../const.ts";
import { IDataQualityResult } from "../types.d.ts";
import { DataQualityOverviewParser } from "../utils/dataQualityOverviewParser.ts";

export class DqdRouter {
  public router = express.Router();
  private dataQualityOverviewParser = new DataQualityOverviewParser();

  constructor() {
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get(
      "/data-quality/flow-run/:flowRunId/results",
      async (req: Request, res: Response) => {
        try {
          const flowRunId = req.params.flowRunId;
          const token = req.headers.authorization!;
          const prefectApi = new PrefectAPI(token);
          const portalServerApi = new PortalServerAPI(token);
          const result = await prefectApi.getFlowRunsArtifacts([flowRunId]);

          if (result.length === 0) {
            res
              .status(500)
              .send(`No DQD result with flowRunId: ${flowRunId} was found`);
          }

          const match = this.regexMatcher(result);
          const filePath = [];
          let dqdResult = [];

          if (match) {
            const s3Path = match[0].slice(1, -1); // Removing the surrounding brackets []
            filePath.push(this.extractRelativePath(s3Path));
            dqdResult = await portalServerApi.getFlowRunResults(filePath);
          } else {
            res.status(500).send("Invalid S3 path found");
          }

          if (this.isDataQualityResult(dqdResult[0])) {
            res.send(dqdResult[0].CheckResults);
          }
          res.status(500).send("Error occurs");
        } catch (error) {
          console.error(`Error occurs while retrieve dqd result: ${error}`);
          res.status(500).send(`Error occurs: ${error}`);
        }
      }
    );

    this.router.get(
      "/data-quality/flow-run/:flowRunId/overview",
      async (req: Request, res: Response) => {
        try {
          const flowRunId = req.params.flowRunId;
          const token = req.headers.authorization!;
          const prefectApi = new PrefectAPI(token);
          const portalServerApi = new PortalServerAPI(token);
          const result = await prefectApi.getFlowRunsArtifacts([flowRunId]);

          if (result.length === 0) {
            res
              .status(500)
              .send(`No DQD result with flowRunId: ${flowRunId} was found`);
          }

          const match = this.regexMatcher(result);
          const filePath = [];
          let dqdResult = [];

          if (match) {
            const s3Path = match[0].slice(1, -1); // Removing the surrounding brackets []
            filePath.push(this.extractRelativePath(s3Path));
            dqdResult = await portalServerApi.getFlowRunResults(filePath);
          } else {
            res.status(500).send("Invalid S3 path found");
          }

          if (this.isDataQualityResult(dqdResult[0])) {
            const overviewResult = this.dataQualityOverviewParser.parse(
              dqdResult[0].CheckResults
            );
            res.send(overviewResult);
          }
          res.status(500).send("Error occurs");
        } catch (error) {
          console.error(
            `Error occurs while retrieve dqd overview result: ${error}`
          );
          res.status(500).send(`Error occurs: ${error}`);
        }
      }
    );

    this.router.get(
      "/data-quality/dataset/:datasetId/flow-run/latest",
      async (req: Request, res: Response) => {
        try {
          const datasetId = req.params.datasetId;
          const token = req.headers.authorization!;
          const prefectApi = new PrefectAPI(token);
          const portalServerApi = new PortalServerAPI(token);
          const { schemaName, databaseCode } = await portalServerApi.getDataset(
            datasetId
          );
          const flowRuns = await prefectApi.getFlowRunsByDataset(
            databaseCode,
            schemaName,
            PrefectTagNames.DQD
          );
          // Only get flows that are run without cohortDefinitionId
          const flowRunsWithoutCohort = flowRuns.filter((flowRun) => {
            return !flowRun.parameters.options.cohortDefinitionId;
          });

          if (flowRunsWithoutCohort.length === 0) {
            return null;
          }
          res.send(flowRunsWithoutCohort[0]);
        } catch (error) {
          res.status(500).send(`Error occurs: ${error}`);
        }
      }
    );
  }

  private redactSensitivePrefectParameters(flowRunParameters: any) {
    const sensitivePrefectParameterKeys = ["token"];

    if (!flowRunParameters.options) {
      return flowRunParameters;
    }

    // Redact any values that have the keys found in redactSensitivePrefectParameters
    for (const sensitiveKey of sensitivePrefectParameterKeys) {
      if (sensitiveKey in flowRunParameters.options) {
        flowRunParameters.options[sensitiveKey] = "<REDACTED>";
      }
    }

    return flowRunParameters;
  }

  private regexMatcher(result: any[]): string[] {
    const regex = /\[s3:\/\/[^)]+\]/;
    return result
      .map((item) => item.description.match(regex))
      .filter((match) => match)
      .flat();
  }

  private extractRelativePath(path: string): string | null {
    const prefix = "s3://flows/";
    const start = path.indexOf(prefix);
    if (start === -1) return null;

    const end = path.indexOf(")", start);
    if (end === -1) return path.substring(start + prefix.length);

    return path.substring(start + prefix.length, end);
  }

  private isDataQualityResult = (
    result: Record<string, any>
  ): result is IDataQualityResult => {
    if (result) {
      const keys = ["Metadata", "Overview", "CheckResults"] as const;
      for (const key of keys) {
        if (
          !Object.prototype.hasOwnProperty.call(result, key) ||
          result[key] === undefined
        ) {
          return false;
        }
      }
      return true;
    }
    return false;
  };
}
