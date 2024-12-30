import pg from "npm:pg";
import { PrefectAPI } from "../api/PrefectAPI.ts";
import { PrefectDeploymentName, PrefectFlowName } from "../const.ts";
import {
  DataModel,
  IGetVersionInfoFlowRunDto,
  PluginFlow,
  ICreateDatamodelFlowRunDto,
  ICreateDatamartFlowRunDto
} from "../types.d.ts";

export class DataModelFlowService {
  private env = Deno.env.toObject();
  private opt = {
    user: this.env.PG_USER,
    password: this.env.PG_PASSWORD,
    host: this.env.PG__HOST,
    port: parseInt(this.env.PG__PORT),
    database: this.env.PG__DB_NAME,
  };
  private pgclient;

  constructor() {
    this.pgclient = new pg.Client(this.opt);
  }
  public async initialize() {
    await this.pgclient.connect();
  }

  public async getDataModels() {
    const plugins = await this.pgclient.query(
      `SELECT payload::JSON FROM trex.plugins WHERE "name" = 'd2e-plugins';`
    );

    let datamodels: DataModel[] = [];
    for (const plugin of plugins.rows) {
      if (plugin.payload.flow.flows) {
        const datamodelFlows = plugin.payload.flow.flows
          .filter((flow: PluginFlow) => flow.type === "datamodel")
          .flatMap(
            ({ name, datamodels }: { name: string; datamodels: string[] }) =>
              (Array.isArray(datamodels) ? datamodels : []).map(
                (datamodel) => ({
                  flowName: name,
                  datamodel: datamodel,
                  flowId: "",
                })
              )
          );
        datamodels = datamodels.concat(datamodelFlows);
      }
    }
    return datamodels;
  }

  public async createGetVersionInfoFlowRun(
    getVersionInfoFlowRunDto: IGetVersionInfoFlowRunDto,
    token: string
  ) {
    const prefectApi = new PrefectAPI(token);
    const flowRunName = getVersionInfoFlowRunDto.flowRunName;
    const options = getVersionInfoFlowRunDto.options;
    const flowRunId = await prefectApi.createFlowRun(
      flowRunName,
      PrefectDeploymentName.DATA_MANAGEMENT,
      PrefectFlowName.DATA_MANAGEMENT,
      options
    );

    await prefectApi.createInputAuthToken(flowRunId);

    await Promise.any([
      new Promise((resolve) => {
        setTimeout(async () => {
          await prefectApi.deleteInputAuthToken(flowRunId);
          resolve(`Deleted the input of ${flowRunId}`);
        }, 5000);
      }),
    ]);

    return flowRunId;
  }

  public async createDatamodelFlowRun(
    createDatamodelFlowRunDto: ICreateDatamodelFlowRunDto,
    token: string
  ) {
    const prefectApi = new PrefectAPI(token);
    const flowRunName = createDatamodelFlowRunDto.flowRunName;
    const options = createDatamodelFlowRunDto.options;
    const result = await prefectApi.createFlowRun(
      flowRunName,
      PrefectDeploymentName.DATA_MANAGEMENT,
      PrefectFlowName.DATA_MANAGEMENT,
      options
    );
    return result;
  }

  public async createDatamartFlowRun(
    createDatamartFlowRunDto: ICreateDatamartFlowRunDto,
    token: string
  ) {
    const prefectApi = new PrefectAPI(token);
    const flowRunName = createDatamartFlowRunDto.flowRunName;
    const options = createDatamartFlowRunDto.options;
    const result = await prefectApi.createFlowRun(
      flowRunName,
      PrefectDeploymentName.DATAMART,
      PrefectFlowName.DATAMART,
      options
    );
    return result;
  }
}
