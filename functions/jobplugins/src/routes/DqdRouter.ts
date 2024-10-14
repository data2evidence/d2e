import express, { Request, Response } from "npm:express@4.18.2";
import { AnalyticsSvcAPI } from "../api/AnalyticsAPI.ts";
import { PortalServerAPI } from "../api/PortalServerAPI.ts";
import { PrefectAPI } from "../api/PrefectAPI.ts";
import { DATA_QUALITY_DOMAINS, PrefectTagNames } from "../const.ts";
import {
  IDataCharacterizationResult,
  IDataQualityResult,
  IDomainContinuityResult,
} from "../types.d.ts";
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

    this.router.get(
      "/data-quality/dataset/:datasetId/cohort/:cohortDefinitionId/flow-run/latest",
      async (req: Request, res: Response) => {
        try {
          const datasetId = req.params.datasetId;
          const cohortDefinitionId = req.params.cohortDefinitionId;
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

          const cohortflowRuns = flowRuns.filter((flowRun) => {
            return (
              flowRun.parameters.options.cohortDefinitionId ===
              cohortDefinitionId
            );
          });

          if (cohortflowRuns.length === 0) {
            return null;
          }

          res.send(cohortflowRuns[0]);
        } catch (error) {
          res.status(500).send(`Error occurs: ${error}`);
        }
      }
    );

    this.router.get(
      "/data-quality/dataset/:datasetId/release/:releaseId/flow-run",
      async (req: Request, res: Response) => {
        try {
          const datasetId = req.params.datasetId;
          const releaseId = req.params.releaseId;
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

          const releaseFlowRuns = flowRuns.find(
            (run) => run.parameters.options.releaseId === releaseId.toString()
          );

          res.send(releaseFlowRuns);
        } catch (error) {
          res.status(500).send(`Error occurs: ${error}`);
        }
      }
    );

    this.router.post(
      "/data-quality/flow-run",
      async (req: Request, res: Response) => {
        try {
          const token = req.headers.authorization!;
          const prefectApi = new PrefectAPI(token);
          const portalServerApi = new PortalServerAPI(token);
          const analyticsSvcApi = new AnalyticsSvcAPI(token);
          console.log(JSON.stringify(req.body));
          const dataQualityFlowRunDto = req.body;

          const dqFlowName = dataQualityFlowRunDto.flowName;
          const dqDeploymentName = dataQualityFlowRunDto.deploymentName;

          const datasetId = dataQualityFlowRunDto.datasetId;
          const comment = dataQualityFlowRunDto.comment;
          let vocabSchema = dataQualityFlowRunDto.vocabSchemaName;
          const releaseId = dataQualityFlowRunDto.releaseId;
          const cohortDefinitionId = dataQualityFlowRunDto.cohortDefinitionId;

          const { dialect, databaseCode, schemaName, vocabSchemaName } =
            await portalServerApi.getDataset(datasetId);

          const releaseDate = (
            await this.getReleaseDate(releaseId, portalServerApi)
          ).split("T")[0];

          if (!vocabSchema) {
            vocabSchema = vocabSchemaName;
          }

          const cdmVersionNumber = await analyticsSvcApi.getCdmVersion(
            dialect,
            databaseCode,
            schemaName
          );

          const name = `${databaseCode}.${schemaName}`;
          const parameters = {
            options: {
              schemaName,
              databaseCode,
              datasetId,
              cdmVersionNumber,
              vocabSchemaName: vocabSchema,
              comment,
              cohortDefinitionId,
              releaseId,
              releaseDate,
            },
          };

          const result = await prefectApi.createFlowRun(
            name,
            dqDeploymentName,
            dqFlowName,
            parameters
          );
          res.send(result);
        } catch (error) {
          res.status(500).send(`Error occurs: ${error}`);
        }
      }
    );
    this.router.get(
      "/data-quality/dataset/:datasetId/history",
      async (req: Request, res: Response) => {
        try {
          const datasetId = req.params.datasetId;
          const token = req.headers.authorization!;
          const prefectApi = new PrefectAPI(token);
          const portalServerApi = new PortalServerAPI(token);
          const dataQualityResults = await this.getDatasetDataQualityResults(
            datasetId,
            portalServerApi,
            prefectApi
          );
          res.send(
            dataQualityResults
              .map((dataQualityResult) => {
                return {
                  cdmReleaseDate: dataQualityResult.Metadata[0].cdmReleaseDate,
                  failed: dataQualityResult.Overview.countOverallFailed[0],
                };
              })
              .sort(
                (a, b) =>
                  this.getDateTime(a.cdmReleaseDate) -
                  this.getDateTime(b.cdmReleaseDate)
              )
          );
        } catch (error) {
          res.status(500).send(`Error occurs: ${error}`);
        }
      }
    );

    this.router.get(
      "/data-quality/dataset/:datasetId/category/history",
      async (req: Request, res: Response) => {
        try {
          const datasetId = req.params.datasetId;
          const token = req.headers.authorization!;
          const prefectApi = new PrefectAPI(token);
          const portalServerApi = new PortalServerAPI(token);
          const dataQualityResults = await this.getDatasetDataQualityResults(
            datasetId,
            portalServerApi,
            prefectApi
          );
          res.send(
            dataQualityResults
              .map((dataQualityResult) => {
                return {
                  cdmReleaseDate: dataQualityResult.Metadata[0].cdmReleaseDate,
                  failed: {
                    completeness:
                      dataQualityResult.Overview.countFailedCompleteness[0],
                    conformness:
                      dataQualityResult.Overview.countFailedConformance[0],
                    plausibility:
                      dataQualityResult.Overview.countFailedPlausibility[0],
                  },
                };
              })
              .sort(
                (a, b) =>
                  this.getDateTime(a.cdmReleaseDate) -
                  this.getDateTime(b.cdmReleaseDate)
              )
          );
        } catch (error) {
          res.status(500).send(`Error occurs: ${error}`);
        }
      }
    );

    this.router.get(
      "/data-quality/dataset/:datasetId/domain/history",
      async (req: Request, res: Response) => {
        try {
          const datasetId = req.params.datasetId;
          const token = req.headers.authorization!;
          const prefectApi = new PrefectAPI(token);
          const portalServerApi = new PortalServerAPI(token);
          const dataQualityResults = await this.getDatasetDataQualityResults(
            datasetId,
            portalServerApi,
            prefectApi
          );
          res.send(
            dataQualityResults
              .map((dataQualityResult) => {
                const domainFailures = dataQualityResult.CheckResults.reduce(
                  (acc, cr) => {
                    if (DATA_QUALITY_DOMAINS.includes(cr.cdmTableName)) {
                      acc[cr.cdmTableName] = cr.failed;
                    } else {
                      console.warn(
                        `Data quality check results does not contain CDM table name: ${JSON.stringify(
                          cr
                        )}`
                      );
                    }
                    return acc;
                  },
                  {}
                );
                return {
                  cdmReleaseDate: dataQualityResult.Metadata[0].cdmReleaseDate,
                  failed: {
                    ...domainFailures,
                  },
                };
              })
              .sort(
                (a, b) =>
                  this.getDateTime(a.cdmReleaseDate) -
                  this.getDateTime(b.cdmReleaseDate)
              )
          );
        } catch (error) {
          res.status(500).send(`Error occurs: ${error}`);
        }
      }
    );

    this.router.get(
      "/data-quality/dataset/:datasetId/domain/continuity",
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
            PrefectTagNames.DATA_CHARACTERIZATION
          );
          const flowRunIds = flowRuns.map((run) => run.id);
          if (!flowRunIds.length) {
            res.send([]);
          }
          const dqdResults = await this.getDqdResults(
            portalServerApi,
            prefectApi,
            flowRunIds
          );
          const domainIndexes: { [key: string]: number } = {};
          res.send(
            dqdResults
              .filter((r) => {
                return this.isDataCharacterizationResult(r.result);
              })
              .reduce((acc, r) => {
                const result = r.result as IDataCharacterizationResult;
                const continuityResults =
                  this.transformToDomainContinuity(result);
                if (acc.length > 0) {
                  continuityResults.forEach((r) => {
                    const domainIndex = domainIndexes[r.domain];
                    acc[domainIndex].records.push(...r.records);
                  });
                } else {
                  continuityResults.forEach(
                    (r, index) => (domainIndexes[r.domain] = index)
                  );
                  acc = continuityResults;
                }
                return acc;
              }, [])
          );
        } catch (error) {
          res.status(500).send(`Error occurs: ${error}`);
        }
      }
    );
  }

  private async getDatasetDataQualityResults(
    datasetId: string,
    portalServerApi: PortalServerAPI,
    prefectApi: PrefectAPI
  ) {
    const { schemaName, databaseCode } = await portalServerApi.getDataset(
      datasetId
    );
    const flowRuns = await prefectApi.getFlowRunsByDataset(
      databaseCode,
      schemaName,
      PrefectTagNames.DQD
    );
    const flowRunIds = flowRuns.map((run) => run.id);
    const dqdResults = await this.getDqdResults(
      portalServerApi,
      prefectApi,
      flowRunIds
    );

    return dqdResults!
      .filter((r) => {
        return this.isDataQualityResult(r);
      })
      .map((r) => r as IDataQualityResult);
  }

  private async getDqdResults(
    portalServerApi: PortalServerAPI,
    prefectApi: PrefectAPI,
    flowRunIds: string[]
  ) {
    let dqdResults;
    const results = await prefectApi.getFlowRunsArtifacts(flowRunIds);
    if (results.length === 0) {
      console.log(
        `No flow run artifacts result found for flowRunIds: ${flowRunIds}`
      );
      return results;
    }
    const match = this.regexMatcher(results);
    const filePaths = [];
    if (match) {
      for (const m of match) {
        const s3Path = m.slice(1, -1); // Removing the surrounding brackets []
        const filePath = this.extractRelativePath(s3Path);
        filePaths.push(filePath);
      }
      dqdResults = await portalServerApi.getFlowRunResults(filePaths);
    }
    return dqdResults;
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

  private async getReleaseDate(
    releaseId: string,
    portalServerApi: PortalServerAPI
  ): Promise<string> {
    if (releaseId) {
      const datasetRelease = await portalServerApi.getDatasetReleaseById(
        releaseId
      );
      return datasetRelease.releaseDate;
    }
    return new Date().toISOString();
  }

  private getDateTime(dateValue: string) {
    return dateValue ? new Date(dateValue).getTime() : 0;
  }

  private transformToDomainContinuity(result: IDataCharacterizationResult) {
    const aresResult = result.exportToAres;
    const domainsRecords = aresResult["records-by-domain"];
    const domainIndexes: { [key: string]: number } = {};
    return domainsRecords.reduce<IDomainContinuityResult[]>((acc, record) => {
      const domain = record.domain;
      const cdmReleaseDate = aresResult.cdmReleaseDate;
      const newCount = {
        cdmReleaseDate: `${cdmReleaseDate.substring(
          0,
          4
        )}-${cdmReleaseDate.substring(4, 6)}-${cdmReleaseDate.substring(6)}`,
        count: record.countRecords,
      };
      if (domainIndexes.hasOwnProperty(domain)) {
        const domainRecord = acc[domainIndexes[domain]];
        domainRecord.records.push(newCount);
      } else {
        domainIndexes[domain] = acc.length;
        acc.push({
          domain,
          records: [newCount],
        });
      }
      return acc;
    }, []);
  }

  // Type Gurad helper functions
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

  private isDataCharacterizationResult = (
    result: Record<string, any>
  ): result is IDataCharacterizationResult => {
    if (result) {
      if (!Object.prototype.hasOwnProperty.call(result, "exportToAres")) {
        return false;
      }

      const aresResult = result["exportToAres"];
      const keys = ["cdmReleaseDate", "records-by-domain"] as const;

      for (const key of keys) {
        if (
          !Object.prototype.hasOwnProperty.call(aresResult, key) ||
          aresResult[key] === undefined
        ) {
          return false;
        }
      }
      return true;
    }
    return false;
  };
}
