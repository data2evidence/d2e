import { v4 as uuidv4 } from "npm:uuid";

import dataSource from "../db/datasource.ts";
import { Canvas } from "../entities/canvas.ts";
import { Graph } from "../entities/graph.ts";
import { UtilsService } from "../utils/DataTransformationParser.ts";
import { PortalServerAPI } from "../api/PortalServerAPI.ts";
import { PrefectAPI } from "../api/PrefectAPI.ts";
import { IDataflowDto, IDataflowDuplicateDto } from "../types.ts";

export class TransformationService {
  private env = Deno.env.toObject();
  private opt = {
    user: this.env.PG_USER,
    password: this.env.PG_PASSWORD,
    host: this.env.PG__HOST,
    port: parseInt(this.env.PG__PORT),
    database: this.env.PG__DB_NAME,
  };
  private readonly logger = console;
  private canvasRepo;
  private graphRepo;
  private utilsService;
  private portalServerApi;
  private prefectApi;

  constructor() {
    this.canvasRepo = dataSource.getRepository(Canvas);
    this.graphRepo = dataSource.getRepository(Graph);
    this.utilsService = new UtilsService();
  }

  async getLatestGraphByCanvasId(id: string) {
    return await this.graphRepo
      .createQueryBuilder("revision")
      .leftJoin("revision.canvas", "dataflow")
      .select([
        "dataflow.id",
        "dataflow.name",
        "revision.id",
        "revision.flow",
        "revision.comment",
        "revision.createdDate",
        "revision.createdBy",
        "revision.version",
      ])
      .where("dataflow.id = :id", { id })
      .orderBy("revision.createdDate", "DESC")
      .getOne();
  }

  async getResultsByCanvasId(dataflowId: string, token) {
    const lastFlowRun = await this.canvasRepo
      .createQueryBuilder("dataflow")
      .select("dataflow.lastFlowRunId")
      .where("dataflow.id = :dataflowId", { dataflowId })
      .getOne();

    const lastFlowRunId = lastFlowRun?.lastFlowRunId;
    if (!lastFlowRunId) {
      console.log("No last flowRun found for dataflowId:", dataflowId);
      return [];
    }
    this.prefectApi = new PrefectAPI(token);
    const subflowRuns = await this.prefectApi.getFlowRunsByParentFlowRunId(
      lastFlowRunId
    );
    const flowRunIds = subflowRuns.map((flow) => flow.id);
    const flowResult = await this.prefectApi.getFlowRunsArtifacts(
      subflowRuns.map((item) => item.id)
    );

    if (flowResult.length === 0) {
      console.log(
        `No flow run artifacts result found for flowRunIds: ${flowRunIds}`
      );
      return [];
    }
    // regex will only match flow runs with description which has path
    const match = this.utilsService.regexMatcher(flowResult);
    if (match) {
      let filePath: Array<string | null> = [];
      for (const m of match) {
        const s3Path = m.slice(1, -1); // Removing the surrounding brackets []
        filePath.push(this.utilsService.extractRelativePath(s3Path));
      }
      this.portalServerApi = new PortalServerAPI(token);
      const res = await this.portalServerApi.getFlowRunResults(filePath);

      // TODO: replace the hardcoded transformed after persisted result been updated
      const transformedRes = res.map((result, index) => ({
        nodeName: `p${index + 1}`,
        taskRunResult: {
          result,
        },
        error: false,
        errorMessage: null,
      }));
      return transformedRes;
    }
    throw new Error(`Invalid S3 path found`);
  }

  async getCanvasList() {
    console.log("in service");
    return await this.canvasRepo.createQueryBuilder("dataflow").getMany();
  }

  async createCanvas(dataflowDto: IDataflowDto, token: string) {
    const id = dataflowDto.id ? dataflowDto.id : uuidv4();
    const canvas = {
      id,
      name: dataflowDto.name,
    };

    console.log(`createCanvas with canvas id: ${id}`);
    let version = 1;
    if (dataflowDto.id) {
      const lastDataflowRevision = await this.getLatestGraphByCanvasId(
        dataflowDto.id
      );
      version += lastDataflowRevision.version;
      console.log(`updating a flow by user: ${token}`);
      console.log(JSON.stringify(this.addOwner(token, canvas)));
      await this.canvasRepo.update(
        dataflowDto.id,
        this.addOwner(token, canvas)
      );
    } else {
      console.log(`creating a flow by user: ${token}`);
      await this.canvasRepo.insert(this.addOwner(token, canvas, true));
    }

    const { comment, ...flow } = dataflowDto.dataflow;
    const graphEntity = this.graphRepo.create({
      id: uuidv4(),
      canvasId: canvas.id,
      flow,
      comment,
      version,
    });
    console.log(JSON.stringify(this.addOwner(token, graphEntity)));
    await this.graphRepo.insert(this.addOwner(token, graphEntity, true));
    this.logger.info(
      `Created new revision for dataflow ${canvas.name} with id ${graphEntity.id}`
    );

    return canvas;
  }

  async deleteCanvas(id: string) {
    await this.canvasRepo.delete(id);
    return { id };
  }

  async createDataflowRun(id, prefecflowRunId) {
    await this.canvasRepo.update({ id }, { lastFlowRunId: prefecflowRunId });
    this.logger.info(
      `Created dataflow run for dataflow ${id} with lastflowRunId ${prefecflowRunId}`
    );
  }

  private addOwner<T>(owner, object: T, isNewEntity = false) {
    if (isNewEntity) {
      return {
        ...object,
        createdBy: owner,
        modifiedBy: owner,
      };
    }
    return {
      ...object,
      modifiedBy: owner,
    };
  }

  async duplicateCanvas(
    id: string,
    revisionId: string,
    dataflowDuplicateDto: IDataflowDuplicateDto,
    token
  ) {
    const flowEntity = await this.getCanvas(id);
    const revisionEntity = flowEntity.revisions.find(
      (r) => r.id === revisionId
    );

    if (!revisionEntity) {
      throw new Error("Dataflow Revision does not exist");
    }
    const newDataflowEntity = this.addOwner(
      token,
      this.canvasRepo.create({
        id: uuidv4(),
        name: dataflowDuplicateDto.name,
      }),
      true
    );
    const newRevisionEntity = this.addOwner(
      token,
      this.graphRepo.create({
        id: uuidv4(),
        dataflowId: newDataflowEntity.id,
        flow: revisionEntity.flow,
        version: 1,
      }),
      true
    );

    await this.canvasRepo.insert(newDataflowEntity);
    await this.graphRepo.insert(newRevisionEntity);
    this.logger.info(
      `Created new revision for dataflow ${newDataflowEntity.name} with id ${newRevisionEntity.id}`
    );
    return {
      id: newDataflowEntity.id,
      revisionId: newRevisionEntity.id,
      version: newRevisionEntity.version,
    };
  }

  async deleteGraph(flowId: string, revisionId: string) {
    const flowEntity = await this.getCanvas(flowId);
    if (flowEntity && flowEntity.revisions.find((r) => r.id === revisionId)) {
      await this.graphRepo.delete(revisionId);
      this.logger.info(`Deleted dataflow revision with id ${revisionId}`);

      const lastRev = await this.getLatestGraphByCanvasId(flowId);
      if (!lastRev) {
        await this.canvasRepo.delete(flowId);
      }
      return {
        revisionId,
      };
    }

    throw new Error("Dataflow and/or dataflow revision do not match");
  }

  async getCanvas(id) {
    return await this.graphRepo
      .createQueryBuilder("revision")
      .leftJoin("revision.canvas", "dataflow")
      .select([
        "dataflow.id",
        "dataflow.name",
        "revision.id",
        "revision.flow",
        "revision.comment",
        "revision.createdDate",
        "revision.createdBy",
        "revision.version",
      ])
      .where("dataflow.id = :id", { id })
      .orderBy("revision.createdDate")
      .getOne();
  }
}
