import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateDataflowRevision1684807784847 implements MigrationInterface {
  name = 'UpdateDataflowRevision1684807784847'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_revision" DROP CONSTRAINT "FK_0bccdf321af54de19d6f22eebea"`
    )
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_revision" ADD "comment" character varying`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_revision" ALTER COLUMN "dataflow_id" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_revision" ADD CONSTRAINT "FK_23391948b6662f745f3a2318f52" FOREIGN KEY ("dataflow_id") REFERENCES "dataflow"."dataflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_revision" DROP CONSTRAINT "FK_23391948b6662f745f3a2318f52"`
    )
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_revision" ALTER COLUMN "dataflow_id" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_revision" DROP COLUMN "comment"`)
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_revision" ADD CONSTRAINT "FK_0bccdf321af54de19d6f22eebea" FOREIGN KEY ("dataflow_id") REFERENCES "dataflow"."dataflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
