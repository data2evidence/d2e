import { PrefectAPI } from "../api/PrefectAPI.ts";
import { PrefectDeploymentName, PrefectFlowName } from "../const.ts";
import { CohortGeneratorFlowRunDto } from "../types.d.ts";

export class CohortService {
  public async createCohortGeneratorFlowRun(
    cohortGeneratorFlowRunDto: CohortGeneratorFlowRunDto,
    token: string
  ) {
    const flowName = PrefectFlowName.COHORT;
    const deploymentName = PrefectDeploymentName.COHORT;
    const parameters = cohortGeneratorFlowRunDto;
    const prefectApi = new PrefectAPI(token);
    // TODO: uncomment
    // const flowRunId = await prefectApi.createFlowRun(
    //   `Generate Cohort ${parameters.options.cohortJson.name}`,
    //   deploymentName,
    //   flowName,
    //   parameters
    // );

    // TODO: remove below
    const flowRunId = "";

    await prefectApi.createInputAuthToken(flowRunId);
    setTimeout(
      async () => await prefectApi.deleteInputAuthToken(flowRunId),
      5000
    );

    return { flowRunId };
  }
}
