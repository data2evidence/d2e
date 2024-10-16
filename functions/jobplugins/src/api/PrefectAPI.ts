import dayjs from "npm:dayjs";
import { services } from "../env.ts";
import { IPrefectFlowRunDto } from "../types.d.ts";

interface FlowRunParams {
  name: string;
  message: string;
  deploymentName: string;
  flowName: string;
  parameters: object;
  schedule?: string | null;
}
export class PrefectAPI {
  private readonly baseURL: string;
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
    if (!token) {
      throw new Error("No token passed for Prefect API!");
    }
    if (services.prefect) {
      this.baseURL = services.prefect;
    } else {
      throw new Error("No url is set for Prefect API");
    }
  }

  async getFlowRun(flowRunId: string) {
    const errorMessage = "Error while getting prefect flow run by id";
    try {
      const url = `${this.baseURL}/flow_runs/filter`;
      const data = {
        flow_runs: {
          id: {
            any_: [flowRunId],
          },
        },
      };

      const options = this.createOptions("POST", data);
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`${errorMessage}: ${response.statusText}`);
      }

      const result = await response.json();
      return result[0];
    } catch (error) {
      console.error(`${errorMessage}: ${error}`);
      throw new Error(errorMessage);
    }
  }

  async getFlowRunById(flowId: string) {
    const options = {
      method: "GET",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
    };
    const url = `${this.baseURL}/flow_runs/${flowId}`;
    const result = await fetch(url, options);
    const jsonResponse = await result.json();
    return jsonResponse;
  }

  async getDeployment(deploymentName: string, flowName: string) {
    const errorMessage = "Error while getting prefect deployment";
    try {
      const options = this.createOptions("GET");
      const url = `${this.baseURL}/deployments/name/${flowName}/${deploymentName}`;
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`${errorMessage}: ${response.statusText}`);
      }
      const result = await response.json();
      return {
        deploymentId: result.id,
        infrastructureDocId: result.infrastructure_document_id,
      };
    } catch (error) {
      console.error(
        `Error occurred while getting prefect deployment: ${error}`
      );
      throw error;
    }
  }

  async getFlowRunsByDataset(
    databaseCode: string,
    dataset: string,
    tags: string[] = []
  ) {
    const errorMessage = "Error while getting flow runs by dataset";
    try {
      const url = `${this.baseURL}/flow_runs/filter`;

      const data = {
        sort: "START_TIME_DESC",
        flow_runs: {
          operator: "and_",
          name: { any_: [`${databaseCode}.${dataset}`] },
          tags: { operator: "and_", all_: tags },
        },
      };

      const options = this.createOptions("POST", data);
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`${errorMessage}: ${response.statusText}`);
      }

      const result = await response.json();
      return result as IPrefectFlowRunDto[];
    } catch (error) {
      console.error(`${errorMessage}: ${error}`);
      throw error;
    }
  }

  async getFlowRunsArtifacts(ids: string[]) {
    const errorMessage = `Error while getting prefect flow run artifacts by ids: ${ids}`;
    try {
      const data: Record<string, string | object> = {
        artifacts: {
          flow_run_id: {
            any_: ids,
          },
        },
      };
      const url = `${this.baseURL}/artifacts/filter`;
      const options = this.createOptions("POST", data);
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch artifacts: ${response.statusText}`);
      }

      const result = await response.json();
      const filteredResult = result.filter(
        (item: { task_run_id: string | null }) => item.task_run_id !== null
      ); // Keep only task runs with non-null taskRunId

      return filteredResult;
    } catch (error) {
      console.error(`${errorMessage}: ${error}`);
      throw error;
    }
  }

  async createFlowRun(
    name: string,
    deploymentName: string,
    flowName: string,
    parameters: object,
    schedule = null
  ) {
    console.log(`Executing flow run ${name}...`);
    const message = `Flow run '${name}' has started from trex function`;
    return await this.executeFlowRun({
      name,
      message,
      deploymentName,
      flowName,
      parameters,
      schedule,
    });
  }

  private async executeFlowRun({
    name,
    message,
    deploymentName,
    flowName,
    parameters,
    schedule = null,
  }: FlowRunParams) {
    const errorMessage = "Error while executing flow run";
    const { deploymentId, infrastructureDocId } = await this.getDeployment(
      deploymentName,
      flowName
    );
    const data = {
      state: {
        type: "SCHEDULED",
        message,
        ...(schedule ? { state_details: { scheduled_time: schedule } } : {}),
      },
      name,
      parameters,
      infrastructure_document_id: infrastructureDocId,
      empirical_policy: {
        retries: 0,
        retry_delay: 0,
        resuming: false,
      },
    };
    const options = this.createOptions("POST", data);
    const url = `${this.baseURL}/deployments/${deploymentId}/create_flow_run`;

    if (schedule && !dayjs(schedule).isValid()) {
      throw new Error(`Invalid schedule time`);
    }
    if (schedule && dayjs(schedule).isBefore(dayjs())) {
      throw new Error("Schedule time must be in the future");
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`${errorMessage}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.id;
  }

  private createOptions(method: string, data?: object): RequestInit {
    const headers: Record<string, string> = {
      Authorization: this.token,
    };

    // Only add Content-Type for requests that have a body (not for GET)
    if (method !== "GET" && data) {
      headers["Content-Type"] = "application/json";
    }

    return {
      method,
      headers,
      // Only include body for non-GET requests
      body: method !== "GET" && data ? JSON.stringify(data) : undefined,
    };
  }
}
