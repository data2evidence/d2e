import https from "node:https";
import { AxiosRequestConfig } from "npm:axios";
import { env } from "../env.ts";

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
    if (env.GATEWAY_WO_PROTOCOL_FQDN) {
      this.baseURL = `https://${env.GATEWAY_WO_PROTOCOL_FQDN}` + this.endpoint;
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

  async createDatamodelFlowRun() {
    return;
  }

  async getDatamodelList();
}
