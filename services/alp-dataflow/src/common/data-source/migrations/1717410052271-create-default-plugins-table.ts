import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateDefaultPluginsTable1717410052271 implements MigrationInterface {
  name = 'CreateDefaultPluginsTable1717410052271'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dataflow"."default_plugins" ("created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), "pluginId" uuid NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "url" character varying, "status" character varying NOT NULL, "others" text, CONSTRAINT "PK_1b9ea6f39138adf0dd56bd042dc" PRIMARY KEY ("pluginId"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "dataflow"."default_plugins"`)
  }
}
