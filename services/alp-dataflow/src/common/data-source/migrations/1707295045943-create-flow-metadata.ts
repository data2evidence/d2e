import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateFlowMetadata1707295045943 implements MigrationInterface {
  name = 'CreateFlowMetadata1707295045943'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dataflow"."flow_metadata" ("created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), "flowId" uuid NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "entrypoint" character varying NOT NULL, "datamodels" text, "url" character varying, "others" text, CONSTRAINT "PK_2a63e3129a414e5e5eff461ba24" PRIMARY KEY ("flowId"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "dataflow"."flow_metadata"`)
  }
}
