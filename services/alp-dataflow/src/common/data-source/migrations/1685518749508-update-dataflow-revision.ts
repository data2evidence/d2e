import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateDataflowRevision1685518749508 implements MigrationInterface {
  name = 'UpdateDataflowRevision1685518749508'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_revision" ADD "version" integer NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dataflow"."dataflow_revision" DROP COLUMN "version"`)
  }
}
