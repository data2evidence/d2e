import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeDataflowRunToSinglePrimaryKey1693398210239 implements MigrationInterface {
  name = 'ChangeDataflowRunToSinglePrimaryKey1693398210239'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" DROP CONSTRAINT "FK_d0282f44d0d47015b4d3130d3bc"`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_run" DROP CONSTRAINT "FK_3b5360e426d96cdc4e5f78c3902"`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_run" DROP CONSTRAINT "PK_663a350b278f277da0a8b4458ea"`)
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_run" ADD CONSTRAINT "PK_9acce9ac725894a75607fc73ff1" PRIMARY KEY ("flow_run_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_run" ADD CONSTRAINT "FK_3b5360e426d96cdc4e5f78c3902" FOREIGN KEY ("dataflow_id") REFERENCES "dataflow"."dataflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_result" ADD CONSTRAINT "FK_adf69af748355f676505ddcd585" FOREIGN KEY ("flow_run_id") REFERENCES "dataflow"."dataflow_run"("flow_run_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_result" DROP CONSTRAINT "FK_adf69af748355f676505ddcd585"`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_run" DROP CONSTRAINT "FK_3b5360e426d96cdc4e5f78c3902"`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_run" DROP CONSTRAINT "PK_9acce9ac725894a75607fc73ff1"`)
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_run" ADD CONSTRAINT "PK_663a350b278f277da0a8b4458ea" PRIMARY KEY ("dataflow_id", "flow_run_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_run" ADD CONSTRAINT "FK_3b5360e426d96cdc4e5f78c3902" FOREIGN KEY ("dataflow_id") REFERENCES "dataflow"."dataflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_result" ADD CONSTRAINT "FK_d0282f44d0d47015b4d3130d3bc" FOREIGN KEY ("flow_id", "flow_id") REFERENCES "dataflow"."dataflow_run"("dataflow_id","flow_run_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
