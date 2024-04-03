import { MigrationInterface, QueryRunner } from 'typeorm'

export class AnalysisFlow1709010732916 implements MigrationInterface {
  name = 'AnalysisFlow1709010732916'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dataflow"."analysisflow_revision" ("created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL, "flow" jsonb NOT NULL, "comment" character varying, "dataflow_id" uuid NOT NULL, "version" integer NOT NULL, CONSTRAINT "PK_e8de0bd4f580e6cb8384ffa5d13" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "dataflow"."analysisflow" ("created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL, "name" character varying NOT NULL, "last_flow_run_id" uuid, CONSTRAINT "PK_5054c108d33c6b92a9202cf9768" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "dataflow"."analysisflow_result" ("created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), "task_run_id" uuid NOT NULL, "root_flow_run_id" uuid NOT NULL, "flow_run_id" uuid NOT NULL, "node_name" character varying NOT NULL, "task_run_result" jsonb NOT NULL, "error" boolean NOT NULL DEFAULT false, "error_message" character varying, CONSTRAINT "PK_59767285db27f2e0b2b248c272a" PRIMARY KEY ("task_run_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "dataflow"."analysisflow_run" ("created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), "root_flow_run_id" uuid NOT NULL, "dataflow_id" uuid NOT NULL, CONSTRAINT "PK_bfdbb41332e4c97fe7d2fdc7125" PRIMARY KEY ("root_flow_run_id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."analysisflow_revision" ADD CONSTRAINT "FK_7a2dc1b8d6cf3c650cd1a6178d8" FOREIGN KEY ("dataflow_id") REFERENCES "dataflow"."analysisflow"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."analysisflow_result" ADD CONSTRAINT "FK_04e5a5eeb6d0efd3b4229aa5782" FOREIGN KEY ("root_flow_run_id") REFERENCES "dataflow"."analysisflow_run"("root_flow_run_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."analysisflow_run" ADD CONSTRAINT "FK_f7beceafb9341510f74429981dc" FOREIGN KEY ("dataflow_id") REFERENCES "dataflow"."analysisflow"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dataflow"."analysisflow_run" DROP CONSTRAINT "FK_f7beceafb9341510f74429981dc"`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."analysisflow_result" DROP CONSTRAINT "FK_04e5a5eeb6d0efd3b4229aa5782"`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."analysisflow_revision" DROP CONSTRAINT "FK_7a2dc1b8d6cf3c650cd1a6178d8"`
    )
    await queryRunner.query(`DROP TABLE "dataflow"."analysisflow_run"`)
    await queryRunner.query(`DROP TABLE "dataflow"."analysisflow_result"`)
    await queryRunner.query(`DROP TABLE "dataflow"."analysisflow"`)
    await queryRunner.query(`DROP TABLE "dataflow"."analysisflow_revision"`)
  }
}
