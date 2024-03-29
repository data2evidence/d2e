import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateDataflowRunAndAddNodeName1693279462833 implements MigrationInterface {
  name = 'CreateDataflowRunAndAddNodeName1693279462833'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dataflow"."dataflow_run" ("flow_run_id" uuid NOT NULL, "created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), "dataflow_id" uuid NOT NULL, CONSTRAINT "PK_663a350b278f277da0a8b4458ea" PRIMARY KEY ("dataflow_id", "flow_run_id"))`
    )
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" ADD "node_name" character varying NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" DROP COLUMN "node_name"`)
    await queryRunner.query(`DROP TABLE "dataflow"."dataflow_run"`)
  }
}
