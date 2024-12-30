import { v4 as uuidv4 } from "uuid";

import dataSource from "../db/datasource.ts";
import { Canvas } from "../entities/canvas.ts";
import { Graph } from "../entities/graph.ts";
import { IDataflowDto, IDataflowDuplicateDto } from "../types.ts";

export class AnalysisService {
  private readonly logger = console;
  private canvasRepo;
  private graphRepo;

  constructor() {
    this.canvasRepo = dataSource.getRepository(Canvas);
    this.graphRepo = dataSource.getRepository(Graph);
  }

  public async getLastAnalysisflowRevision(id: string) {
    return await this.graphRepo
      .createQueryBuilder("revision")
      .leftJoin("revision.canvas", "analysisflow")
      .select([
        "analysisflow.id",
        "analysisflow.name",
        "analysisflow.lastFlowRunId",
        "revision.id",
        "revision.flow",
        "revision.comment",
        "revision.createdDate",
        "revision.createdBy",
        "revision.version",
      ])
      .where("analysisflow.id = :id", { id })
      .orderBy("revision.createdDate", "DESC")
      .getOne();
  }

  async createAnalysisflow(analysisflowDto: IDataflowDto, token: string) {
    const analysisflowEntity = this.canvasRepo.create({
      id: analysisflowDto.id ? analysisflowDto.id : uuidv4(),
      name: analysisflowDto.name,
      type: "analysis-flow",
    });
    let version = 1;
    const { comment, ...flow } = analysisflowDto.dataflow;

    if (analysisflowDto.id) {
      const lastDataflowRevision = await this.getLastAnalysisflowRevision(
        analysisflowDto.id
      );
      version += lastDataflowRevision.version;
      await this.canvasRepo.update(
        analysisflowDto.id,
        this.addOwner(token, analysisflowEntity)
      );
    } else {
      await this.canvasRepo.insert(
        this.addOwner(token, analysisflowEntity, true)
      );
      this.logger.info(
        `Created new analysisflow ${analysisflowEntity.name} with id ${analysisflowEntity.id}`
      );
    }

    const revisionEntity = this.graphRepo.create({
      id: uuidv4(),
      // analysisflowId: analysisflowEntity.id,
      canvasId: analysisflowEntity.id,
      flow,
      comment,
      version,
    });
    await this.graphRepo.insert(this.addOwner(token, revisionEntity, true));
    this.logger.info(
      `Created new revision for analysisflow ${analysisflowEntity.name} with id ${revisionEntity.id}`
    );
    return {
      id: analysisflowEntity.id,
      revisionId: revisionEntity.id,
      version: revisionEntity.version,
    };
  }

  async deleteAnalysisflow(id: string) {
    await this.canvasRepo.delete(id);
    return { id };
  }

  async createAnalysisflowRun(id, prefectflowRunId) {
    await this.canvasRepo.update({ id }, { lastFlowRunId: prefectflowRunId });
    this.logger.info(
      `Created analysisflow run for analysisflow (${id}) and prefect flow run (${prefectflowRunId})`
    );
  }

  private addOwner<T>(owner, object: T, isNewEntity = false) {
    if (isNewEntity) {
      return {
        ...object,
        createdBy: owner.sub,
        modifiedBy: owner.sub,
      };
    }
    return {
      ...object,
      modifiedBy: owner.sub,
    };
  }

  async duplicateAnalysisflow(
    id: string,
    revisionId: string,
    analysisflowDuplicateDto: IDataflowDuplicateDto,
    token
  ) {
    const flowEntity = await this.getAnalysisflow(id);
    const revisionEntity = flowEntity.revisions.find(
      (r) => r.id === revisionId
    );

    if (!revisionEntity) {
      throw new Error("Analysisflow Revision does not exist");
    }
    const newAnalysisflowEntity = this.addOwner(
      token,
      this.canvasRepo.create({
        id: uuidv4(),
        name: analysisflowDuplicateDto.name,
        type: "analysis-flow",
      }),
      true
    );
    const newRevisionEntity = this.addOwner(
      token,
      this.graphRepo.create({
        id: uuidv4(),
        // analysisflowId: newAnalysisflowEntity.id,
        canvasId: newAnalysisflowEntity.id,
        flow: revisionEntity.flow,
        version: 1,
      }),
      true
    );

    await this.canvasRepo.insert(newAnalysisflowEntity);
    await this.graphRepo.insert(newRevisionEntity);
    this.logger.info(
      `Created new revision for analysisflow ${newAnalysisflowEntity.name} with id ${newRevisionEntity.id}`
    );
    return {
      id: newAnalysisflowEntity.id,
      revisionId: newRevisionEntity.id,
      version: newRevisionEntity.version,
    };
  }

  async deleteAnalysisflowRevision(flowId: string, revisionId: string) {
    const flowEntity = await this.getAnalysisflow(flowId);
    if (flowEntity && flowEntity.revisions.find((r) => r.id === revisionId)) {
      await this.graphRepo.delete(revisionId);
      this.logger.info(`Deleted analysisflow revision with id ${revisionId}`);

      const lastRev = await this.getLastAnalysisflowRevision(flowId);
      if (!lastRev) {
        await this.canvasRepo.delete(flowId);
      }
      return {
        revisionId,
      };
    }

    throw new Error("Analysisflow and/or analysisflow revision do not match");
  }

  async getAnalysisflows() {
    return await this.canvasRepo
      .createQueryBuilder("analysisflow")
      .where("analysisflow.type = :type", { type: "analysis-flow" })
      .getMany();
  }

  async getAnalysisflow(id) {
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
