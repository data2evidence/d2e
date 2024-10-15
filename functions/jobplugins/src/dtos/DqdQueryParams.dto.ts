interface DataQualityFlowRunDto {
  datasetId: string;
  deploymentName: string;
  flowName: string;
  comment?: string;
  vocabSchemaName?: string;
  releaseId?: string;
  cohortDefinitionId?: string;
}

export class DqdQueryParamsDto {
  private flowRunId: string;
  private datasetId: string;
  private cohortDefinitionId?: string;
  private releaseId?: string;
  private deploymentName?: string;
  private flowName?: string;
  private comment?: string;
  private vocabSchemaName?: string;

  constructor(params: any, body?: DataQualityFlowRunDto) {
    this.flowRunId = params.flowRunId;
    this.datasetId = params.datasetId;
    this.cohortDefinitionId = params.cohortDefinitionId;
    this.releaseId = params.releaseId;

    if (body) {
      this.datasetId = body.datasetId;
      this.deploymentName = body.deploymentName;
      this.flowName = body.flowName;
      this.comment = body.comment;
      this.vocabSchemaName = body.vocabSchemaName;
      this.releaseId = body.releaseId;
      this.cohortDefinitionId = body.cohortDefinitionId;
    }
  }

  // Validation method to check required params
  public validateParams() {
    if (this.flowRunId && typeof this.flowRunId !== "string") {
      throw new Error("Invalid flowRunId");
    }

    if (this.datasetId && typeof this.datasetId !== "string") {
      throw new Error("Invalid datasetId");
    }

    if (
      this.cohortDefinitionId &&
      typeof this.cohortDefinitionId !== "string"
    ) {
      throw new Error("Invalid cohortDefinitionId");
    }

    if (this.releaseId && typeof this.releaseId !== "string") {
      throw new Error("Invalid releaseId");
    }
  }

  public validateRequestBody() {
    if (this.datasetId && typeof this.datasetId !== "string") {
      throw new Error("Invalid datasetId");
    }

    if (!this.deploymentName || typeof this.deploymentName !== "string") {
      throw new Error("Invalid deploymentName");
    }

    if (!this.flowName || typeof this.flowName !== "string") {
      throw new Error("Invalid flowName");
    }

    if (this.comment && typeof this.comment !== "string") {
      throw new Error("Invalid comment");
    }

    if (this.vocabSchemaName && typeof this.vocabSchemaName !== "string") {
      throw new Error("Invalid vocabSchemaName");
    }

    if (this.releaseId && typeof this.releaseId !== "string") {
      throw new Error("Invalid releaseId");
    }

    if (
      this.cohortDefinitionId &&
      typeof this.cohortDefinitionId !== "string"
    ) {
      throw new Error("Invalid cohortDefinitionId");
    }
  }
}
