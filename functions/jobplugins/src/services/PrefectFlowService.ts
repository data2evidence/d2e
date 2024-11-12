import pg from "npm:pg";

export class PrefectFlowService {
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

  public async getDatamodels() {
    const plugins = await this.pgclient.query(
      `SELECT payload::JSON FROM trex.plugins WHERE "name" = 'd2e-plugins';`
    );

    let datamodels = [];
    for (const plugin of plugins.rows) {
      if (plugin.payload.flow.flows) {
        const datamodelFlows = plugin.payload.flow.flows
          .filter((flow) => flow.type === "datamodel")
          .flatMap(({ name, datamodels }) =>
            (Array.isArray(datamodels) ? datamodels : []).map((datamodel) => ({
              flowName: name,
              datamodel: datamodel,
              flowId: "",
            }))
          );
        datamodels = datamodels.concat(datamodelFlows);
      }
    }
    return datamodels;
  }
}
