import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateDataflowResult1691378171085 implements MigrationInterface {
  name = 'UpdateDataflowResult1691378171085'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" ADD "error" boolean NOT NULL DEFAULT false`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" ADD "error_message" character varying`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" ALTER COLUMN "created_by" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" ALTER COLUMN "created_date" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" ALTER COLUMN "modified_by" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" ALTER COLUMN "modified_date" SET NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" ALTER COLUMN "modified_date" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" ALTER COLUMN "modified_by" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" ALTER COLUMN "created_date" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" ALTER COLUMN "created_by" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" DROP COLUMN "error_message"`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" DROP COLUMN "error"`)
  }
}
