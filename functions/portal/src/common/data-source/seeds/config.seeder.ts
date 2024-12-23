import { DataSource } from "npm:typeorm";
import { Seeder } from "typeorm-extension";
import { Config } from "../../../config/entity/index.ts";

export default class ConfigSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Config);

    const result = await repository.createQueryBuilder("config").getMany();
    if (result.length > 0) {
      return;
    }

    const entities = repository.create({
      type: "overview-description",
      value:
        "Our vision is a world where health data is comprehensively, digitally, and securely available for research and directly impacts the prevention, diagnosis, and treatment of diseases.",
      createdBy: "system",
      modifiedBy: "system",
    });
    await repository.save(entities);
  }
}
