import { services } from "../env.ts";

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
        // Authorization: this.token,
        "Content-Type": "application/json",
      },
    };
    const url = `${this.baseURL}/flow-runs/${flowId}`;
    const result = await fetch(url, options);
    const jsonResponse = await result.json();
    return jsonResponse;
  }
}
