import https from "node:https";
import { AxiosRequestConfig } from "npm:axios";
import { env, services } from "../env.ts";
import { get } from "./request-util.ts";

export class AnalyticsSvcAPI {
  private readonly baseURL: string;
  private readonly httpsAgent: any;
  private readonly token: string;
  private readonly endpoint: string = "/analytics-svc/api/services";

  constructor(token: string) {
    this.token = token;
    if (!token) {
      throw new Error("No token passed for Analytics API!");
    }

    if (services.analytics) {
      this.baseURL = services.analytics + this.endpoint;
      this.httpsAgent = new https.Agent({
        rejectUnauthorized: true,
        ca: env.GATEWAY_CA_CERT,
      });
    } else {
      console.error("No url is set for AnalyticsSvcAPI");
      throw new Error("No url is set for AnalyticsAPI");
    }
  }

  isAuthorized(): boolean {
    return this.baseURL.startsWith("https://localhost:") ||
      this.baseURL.startsWith("https://alp-minerva-gateway-")
      ? false
      : true;
  }

  async getDataCharacterizationResults(
    databaseCode: string,
    resultsSchema: string,
    sourceKey: string,
    vocabSchema: string,
    datasetId: string
  ) {
    const errorMessage = "Error while getting data characterization results";
    try {
      console.log(`vocabSchema ${vocabSchema} datasetId ${datasetId}`);
      // const options = await this.getRequestConfig();
      const options = await this.createOptions("GET");
      //add studyid
      const url = `${
        this.baseURL
      }/data-characterization/${databaseCode}/${vocabSchema}/${resultsSchema.toLowerCase()}/${sourceKey}?studyId=${datasetId}`;
      const response = await fetch(url, options);
      return await response.json();
    } catch (error) {
      console.error(`${errorMessage}: ${error}`);
      throw error;
    }
  }

  // Fetch Data Characterization Drilldown
  async getDataCharacterizationResultsDrilldown(
    databaseCode: string,
    resultsSchema: string,
    sourceKey: string,
    conceptId: string,
    vocabSchema: string,
    datasetId: string
  ) {
    try {
      const url = `${
        this.baseURL
      }/data-characterization/${databaseCode}/${vocabSchema}/${resultsSchema.toLowerCase()}/${sourceKey}/${conceptId}?studyId=${datasetId}`;
      console.log(`Calling ${url} for conceptId ${conceptId}`);
      const options = this.createOptions("GET");
      const result = await fetch(url, options);
      if (!result.ok) {
        throw new Error(
          "Error while getting data characterization results drilldown"
        );
      }
      return await result.json();
    } catch (error) {
      console.error(
        `Error while getting data characterization drilldown: ${error}`
      );
      throw error;
    }
  }

  // TODO: Fix Invalid CA cert error
  // Fetch CDM version
  async getCdmVersion(dialect: string, databaseCode: string, schema: string) {
    try {
      const url = `${this.baseURL}/alpdb/${dialect}/database/${databaseCode}/cdmversion/schema/${schema}`;
      console.log(`Calling ${url} to fetch CDM version`);
      // const options = this.createOptions("GET");
      const options = this.getRequestConfig();
      // const result = await fetch(url, options);
      const result = await get(url, options);
      // if (!result.ok) {
      //   throw new Error("Error while getting cdm version");
      // }
      // return await result.json();
      return result.data;
    } catch (error) {
      console.error(`Error while getting cdm version: ${error}`);
      throw error;
    }
  }

  // Helper method to generate options for fetch
  private createOptions(method: string): RequestInit {
    return {
      method,
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
    };
  }

  private getRequestConfig() {
    let options: AxiosRequestConfig = {};

    options = {
      headers: {
        Authorization: this.token,
      },
      httpsAgent: this.httpsAgent,
      timeout: 20000,
    };

    return options;
  }
}