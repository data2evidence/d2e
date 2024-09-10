import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateDatasetAddCustomDataModel17211757718561 implements MigrationInterface {
  name = 'UpdateDatasetAddCustomDataModel17211757718561'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "portal"."dataset" ADD "data_model_custom" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "portal"."dataset" DROP COLUMN "data_model_custom"`)
  }
}
