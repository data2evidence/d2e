import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateFlowrunColumnName1698328552090 implements MigrationInterface {
  name = 'UpdateFlowrunColumnName1698328552090'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" DROP CONSTRAINT "FK_adf69af748355f676505ddcd585"`)
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_result" RENAME COLUMN "flow_run_id" TO "root_flow_run_id"`
    )
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" RENAME COLUMN "flow_id" TO "flow_run_id"`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_run" RENAME COLUMN "flow_run_id" TO "root_flow_run_id"`)
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_run" RENAME CONSTRAINT "PK_9acce9ac725894a75607fc73ff1" TO "PK_730696b2be922ab51c849df7f33"`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_result" ADD CONSTRAINT "FK_2cdb4684d34bbb122364570e781" FOREIGN KEY ("root_flow_run_id") REFERENCES "dataflow"."dataflow_run"("root_flow_run_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" DROP CONSTRAINT "FK_2cdb4684d34bbb122364570e781"`)
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_run" RENAME CONSTRAINT "PK_730696b2be922ab51c849df7f33" TO "PK_9acce9ac725894a75607fc73ff1"`
    )
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_run" RENAME COLUMN "root_flow_run_id" TO "flow_run_id"`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" RENAME COLUMN "flow_run_id" TO "flow_id"`)
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_result" RENAME COLUMN "root_flow_run_id" TO "flow_run_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_result" ADD CONSTRAINT "FK_adf69af748355f676505ddcd585" FOREIGN KEY ("flow_run_id") REFERENCES "dataflow"."dataflow_run"("flow_run_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
