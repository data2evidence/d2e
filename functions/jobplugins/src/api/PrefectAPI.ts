import { services } from "../env.ts";
import { IPrefectFlowRunDto } from "../types.d.ts";

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
      throw new Error("No url is set for PrefectAPI");
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

  private createOptions(method: string, data?: object): RequestInit {
    return {
      method,
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    };
  }
}
