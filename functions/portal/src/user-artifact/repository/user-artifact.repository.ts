import { Inject, Injectable } from "@danet/core";
import { Repository } from "typeorm";
import { DATABASE } from "../../database/module.ts";
import { PostgresService } from "../../database/postgres.service.ts";
import { UserArtifact } from "../entity/user-artifact.entity.ts";
import { ServiceName } from "../enums/index.ts";
@Injectable()
export class UserArtifactRepository {
  private repository: Repository<UserArtifact> | null = null;
  constructor(@Inject(DATABASE) private dbService: PostgresService) {}
  private async getRepository() {
    if (!this.repository) {
      const dataSource = await this.dbService.getDataSourceAsync();
      this.repository = dataSource.getRepository(UserArtifact);
    }
    return this.repository;
  }

  async findOne(userId: string): Promise<UserArtifact | null> {
    const repository = await this.getRepository();
    return await repository.findOne({
      where: {
        userId: userId,
      },
    });
  }

  async find(): Promise<UserArtifact[]> {
    const repository = await this.getRepository();
    return await repository.find();
  }

  async create(entity: Partial<UserArtifact>): Promise<UserArtifact> {
    const repository = await this.getRepository();
    return await repository.create(entity);
  }

  async update(entity: Partial<UserArtifact>): Promise<UserArtifact | null> {
    const repository = await this.getRepository();

    await repository.update(
      { userId: entity.userId },
      {
        artifacts: entity.artifacts,
        modifiedBy: entity.modifiedBy,
        modifiedDate: new Date(),
      }
    );

    return await repository.findOneBy({ userId: entity.userId });
  }

  async save(entity: Partial<UserArtifact>): Promise<UserArtifact> {
    const repository = await this.getRepository();
    return await repository.save(entity);
  }

  async getAllServiceArtifacts(
    serviceName: ServiceName
  ): Promise<UserArtifact[]> {
    const repository = await this.getRepository();
    const result = await repository
      .createQueryBuilder("user_artifact")
      .select(
        `jsonb_array_elements(user_artifact.artifacts->:serviceName)`,
        "artifact"
      )
      .where(`user_artifact.artifacts ? :serviceName`, { serviceName })
      .getRawMany();
    return result.map((row) => row.artifact);
  }

  async findSharedArtifacts(
    userId: string,
    serviceName: ServiceName
  ): Promise<UserArtifact[]> {
    const repository = await this.getRepository();
    return repository
      .createQueryBuilder("userArtifact")
      .where("userArtifact.userId != :userId", { userId })
      .andWhere(`userArtifact.artifacts ? :serviceName`, { serviceName })
      .getMany();
  }

  async findByServiceArtifactId(
    serviceName: string,
    id: string
  ): Promise<UserArtifact[]> {
    const repository = await this.getRepository();
    return repository
      .createQueryBuilder("user_artifact")
      .where(`user_artifact.artifacts->:serviceName @> :jsonValue`, {
        serviceName,
        jsonValue: JSON.stringify([{ id }]),
      })
      .getMany();
  }
}
