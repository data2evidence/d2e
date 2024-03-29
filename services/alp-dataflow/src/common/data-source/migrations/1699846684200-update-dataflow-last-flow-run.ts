import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateDataflowLastFlowRun1699846684200 implements MigrationInterface {
  name = 'UpdateDataflowLastFlowRun1699846684200'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow" ADD "last_flow_run_id" uuid`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow" DROP COLUMN "last_flow_run_id"`)
  }
}
