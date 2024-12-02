import { PrefectAPI } from "../api/PrefectAPI.ts";
import {
  FlowRunState,
  PrefectDeploymentName,
  PrefectFlowName,
} from "../const.ts";
import { ICreateCachedbFileFlowRunDto } from "../types.d.ts";

export class CachedbService {
  public async createCachedbFileFlowRun(
    createCachedbFileFlowRunDto: ICreateCachedbFileFlowRunDto,
    token: string
  ) {
    const prefectApi = new PrefectAPI(token);
    const flowName = PrefectFlowName.CACHEDB_CREATE_FILE;
    const deploymentName = PrefectDeploymentName.CACHEDB_CREATE_FILE;
    const parameters = createCachedbFileFlowRunDto;
    const flowRunId = await prefectApi.createFlowRun(
      `Run cachedb file creation`,
      deploymentName,
      flowName,
      parameters
    );
    return { flowRunId };
  }

  public async getFlowRunResults(flowRunId: string, token: string) {
    const prefectApi = new PrefectAPI(token);
    const flowRun: FlowRunState = await prefectApi.getFlowRun(flowRunId);
    return flowRun;
  }
}
