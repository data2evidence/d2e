import { AxiosRequestConfig } from "axios";
import { post, get } from "./request-util";
import { getProperties, getLogger } from "../utils/config";
import { VersionInfoType, DatasetSchemaMappingType } from "../utils/types";

export default class DataflowMgmtAPI {
  private readonly dataflowMgmtAPIUrl: string;
  private readonly properties = getProperties();
  private logger = getLogger();

  constructor() {
    if (this.properties.dataflow_mgmt_api_base_url) {
      this.dataflowMgmtAPIUrl = this.properties.dataflow_mgmt_api_base_url;
    } else {
      throw new Error("No url is set for dataflowMgmtAPIUrl");
    }
  }

  async createUpdateAttributesFlowRun(
    versionInfo: VersionInfoType,
    portalToken: string,
    datasetSchemaMapping: Array<DatasetSchemaMappingType>
  ) {
    const options: AxiosRequestConfig = {
      headers: {
        Authorization: portalToken,
      },
    };

    const requestBody = {
      token: portalToken,
      versionInfo: versionInfo,
      datasetSchemaMapping: datasetSchemaMapping,
    };

    // create flow run from deployment
    let response;
    try {
      response = await post(
        `${this.dataflowMgmtAPIUrl}/db-svc/dataset-attributes`,
        requestBody,
        options
      );
    } catch (err) {
      return err;
    }
    return response;
  }
}
