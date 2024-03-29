import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateDbExtra1704846290461 implements MigrationInterface {
  name = 'UpdateDbExtra1704846290461'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "db_credentials_mgr"."db_extra" DROP COLUMN "value"`)
    await queryRunner.query(`ALTER TABLE "db_credentials_mgr"."db_extra" ADD "value" jsonb NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "db_credentials_mgr"."db_extra" DROP COLUMN "value"`)
    await queryRunner.query(`ALTER TABLE "db_credentials_mgr"."db_extra" ADD "value" character varying NOT NULL`)
  }
}
