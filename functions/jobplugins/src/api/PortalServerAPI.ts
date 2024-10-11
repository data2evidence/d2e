import { env, services } from "../env.ts";

export class PortalServerAPI {
  private readonly baseURL: string;
  private readonly token: string;
  // private readonly httpClient: Deno.HttpClient;

  constructor(token: string) {
    this.token = token;
    if (!token) {
      throw new Error("No token passed for PortalServerAPI!");
    }
    if (services.prefect) {
      this.baseURL = services.portalServer;
      // this.httpClient = Deno.createHttpClient({
      //   caCerts: [env.SSL_CA_CERT!]
      // })
    } else {
      throw new Error("No url is set for PortalServerAPI");
    }
  }

  isAuthorized(): boolean {
    return this.baseURL.startsWith("https://localhost:") ||
      this.baseURL.startsWith("https://alp-minerva-gateway-")
      ? false
      : true;
  }

  async getDatasetReleaseById(
    releaseId: string
  ): Promise<{ releaseDate: string }> {
    try {
      const url = `${this.baseURL}/dataset/release/${releaseId}`;
      const options = this.createOptions("GET");
      const result = await fetch(url, options);
      if (!result.ok) {
        throw new Error("Error while getting dataset release by id");
      }
      return await result.json();
    } catch (error) {
      console.error(`Error while getting dataset release by id: ${error}`);
      throw error;
    }
  }

  async getDataset(datasetId: string) {
    try {
      const url = `${this.baseURL}/dataset/${datasetId}`;
      const options = this.createOptions("GET");
      const result = await fetch(url, options);
      if (!result.ok) {
        throw new Error("Error while getting dataset by datasetId");
      }
      return await result.json();
    } catch (error) {
      console.error(`Error while getting dataset by datasetId: ${error}`);
      throw error;
    }
  }
  // TODO: Comfirm if we no longer save deployment resource to S3
  async deleteDeploymentFiles(deploymentFolderPath: string) {
    try {
      const url = `${this.baseURL}/prefect?filePath=${deploymentFolderPath}&bucketName=${env.ADHOC_DEPLOYMENT_FLOWS_BUCKET_NAME}`;
      console.info(url);
      const options = this.createOptions("DELETE");
      const result = await fetch(url, options);
      if (!result.ok) {
        throw new Error("Error while deleting deployment files");
      }
      return await result.json();
    } catch (error) {
      console.error(`Error while deleting deployment files: ${error}`);
      throw error;
    }
  }

  async getFlowRunResults(filePaths) {
    try {
      let url = `${this.baseURL}/prefect/results`;
      const params = new URLSearchParams();
      if (filePaths.length === 1) {
        params.append("filePath", filePaths[0]);
      } else {
        filePaths.forEach((path) => params.append("filePaths[]", path));
      }
      url += `?${params.toString()}`;
      console.info(url);
      const options = this.createOptions("GET");
      const result = await fetch(url, options);
      if (!result.ok) {
        throw new Error(
          `Error while getting flow run results with filePath ${filePaths}`
        );
      }
      const data = await result.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error(
        `Error while getting flow run results with filePath ${filePaths}: ${error}`
      );
      throw error;
    }
  }

  private createOptions(method: string): RequestInit {
    return {
      method,
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
    };
  }
}
