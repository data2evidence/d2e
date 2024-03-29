import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateDataflowCascadeDelete1700711768191 implements MigrationInterface {
  name = 'UpdateDataflowCascadeDelete1700711768191'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" DROP CONSTRAINT "FK_2cdb4684d34bbb122364570e781"`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_run" DROP CONSTRAINT "FK_3b5360e426d96cdc4e5f78c3902"`)
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_revision" DROP CONSTRAINT "FK_23391948b6662f745f3a2318f52"`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_result" ADD CONSTRAINT "FK_2cdb4684d34bbb122364570e781" FOREIGN KEY ("root_flow_run_id") REFERENCES "dataflow"."dataflow_run"("root_flow_run_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_run" ADD CONSTRAINT "FK_3b5360e426d96cdc4e5f78c3902" FOREIGN KEY ("dataflow_id") REFERENCES "dataflow"."dataflow"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_revision" ADD CONSTRAINT "FK_23391948b6662f745f3a2318f52" FOREIGN KEY ("dataflow_id") REFERENCES "dataflow"."dataflow"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_revision" DROP CONSTRAINT "FK_23391948b6662f745f3a2318f52"`
    )
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_run" DROP CONSTRAINT "FK_3b5360e426d96cdc4e5f78c3902"`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" DROP CONSTRAINT "FK_2cdb4684d34bbb122364570e781"`)
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_revision" ADD CONSTRAINT "FK_23391948b6662f745f3a2318f52" FOREIGN KEY ("dataflow_id") REFERENCES "dataflow"."dataflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_run" ADD CONSTRAINT "FK_3b5360e426d96cdc4e5f78c3902" FOREIGN KEY ("dataflow_id") REFERENCES "dataflow"."dataflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_result" ADD CONSTRAINT "FK_2cdb4684d34bbb122364570e781" FOREIGN KEY ("root_flow_run_id") REFERENCES "dataflow"."dataflow_run"("root_flow_run_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
