import express from "npm:express@4.18.2";
import { PrefectAPI } from "../api/PrefectAPI.ts";

export class DeploymentRouter {
  public router = express.Router();

  constructor() {
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get("/flow-run/:id", async (req, res) => {
      const { flowId } = req.params;
      try {
        const token = req.headers.authorization!;
        const prefectApi = new PrefectAPI(token);
        console.log("I am here");
        const flowRun = await prefectApi.getFlowRunById(flowId);
        // Redact sensitive input parameters for all flow runs
        flowRun.parameters = this.redactSensitivePrefectParameters(
          flowRun.parameters
        );

        res.send(flowRun);
      } catch (error) {
        // this.logger.error(`Error when getting dashboards: ${JSON.stringify(error)}`)
        console.log("sss");
        res.status(500).send("Error when getting dashboards");
      }
    });
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
}
