import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateDqdResultTable1694579056156 implements MigrationInterface {
  name = 'CreateDqdResultTable1694579056156'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dataflow"."dqd_result" ("flow_run_id" uuid NOT NULL, "result" jsonb NOT NULL, "error" boolean NOT NULL DEFAULT false, "error_message" character varying, CONSTRAINT "PK_a45f7f29cfba20b64e2d7339808" PRIMARY KEY ("flow_run_id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "dataflow"."dqd_result"`)
  }
}
