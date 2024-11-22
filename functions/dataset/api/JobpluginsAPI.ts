import https from "node:https";
import { AxiosRequestConfig } from "npm:axios";
import { ICreateDatamodelFlowRunDto } from "../../jobplugins/src/types.d.ts";
import { services } from "../env.ts";
import { get, post } from "./request-util.ts";

export class JobPluginsAPI {
  private readonly baseURL: string;
  private readonly httpsAgent: any;
  private readonly logger = console; //createLogger(this.constructor.name)
  private readonly token: string;
  private readonly endpoint: string = "/jobplugins/";
  constructor(token: string) {
    this.token = token;
    if (!token) {
      throw new Error("No token passed for Jobplugins API!");
    }
    if (services.jobplugins) {
      this.baseURL = services.jobplugins + this.endpoint;
      this.httpsAgent = new https.Agent({
        rejectUnauthorized: true,
        // ca: env.GATEWAY_CA_CERT
      });
    } else {
      this.logger.error("No url is set for JobpluginsAPI");
      throw new Error("No url is set for JobpluginsAPI");
    }
  }

  private async getRequestConfig() {
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

  async createDatamodelFlowRun(data: ICreateDatamodelFlowRunDto) {
    this.logger.info("Running create datamodel flow run");
    const options = await this.getRequestConfig();
    const url = `${this.baseURL}datamodel/create_datamodel_run`;
    const result = await post(url, data, options);
    if (result.data) {
      return result.data;
    }
    throw new Error("Failed create datamodel flow run");
  }

  async getDatamodels() {
    this.logger.info("Running get datamodel list");
    const options = await this.getRequestConfig();
    const url = `${this.baseURL}datamodel/list`;
    const result = await get(url, options);
    if (result.data) {
      return result.data;
    }
    throw new Error("Failed get datamodels");
  }
}
