import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateDataflowResult1689744119782 implements MigrationInterface {
  name = 'CreateDataflowResult1689744119782'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dataflow"."dataflow_result" ("task_run_id" uuid NOT NULL, "flow_run_id" uuid NOT NULL, "flow_id" uuid NOT NULL, "task_run_result" jsonb NOT NULL, "created_by" character varying NULL, "created_date" TIMESTAMP NULL DEFAULT now(), "modified_by" character varying NULL, "modified_date" TIMESTAMP NULL DEFAULT now(),CONSTRAINT "PK_7af6aef85262d9bfc0ae32d411e" PRIMARY KEY ("task_run_id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "dataflow"."dataflow_result"`)
  }
}
