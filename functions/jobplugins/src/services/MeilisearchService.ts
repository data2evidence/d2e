import { PrefectAPI } from "../api/PrefectAPI.ts";
import { PrefectDeploymentName, PrefectFlowName } from "../const.ts";
import { MeilisearchAddIndexFlowRunDto } from "../types_1.ts";

export class MeilisearchService {
  public async createAddIndexFlowRun(
    meilisearchAddIndexFlowRunDto: MeilisearchAddIndexFlowRunDto,
    token: string
  ) {
    const prefectApi = new PrefectAPI(token);
    const flowName = PrefectFlowName.MEILISEARCH_ADD_INDEX;
    const deploymentName = PrefectDeploymentName.MEILISEARCH_ADD_INDEX;
    const databaseCode = meilisearchAddIndexFlowRunDto.databaseCode;
    const vocabSchemaName = meilisearchAddIndexFlowRunDto.vocabSchemaName;
    const tableName = meilisearchAddIndexFlowRunDto.tableName;
    const parameters = {
      options: {
        databaseCode,
        vocabSchemaName,
        tableName,
      },
    };

    const flowRunId = await prefectApi.createFlowRun(
      `Meilisearch Add Index: ${databaseCode}_${vocabSchemaName}_${tableName}`,
      deploymentName,
      flowName,
      parameters
    );
    return { flowRunId };
  }
}
