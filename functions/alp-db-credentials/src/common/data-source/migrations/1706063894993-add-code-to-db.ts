import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCodeToDb1706063894993 implements MigrationInterface {
  name = 'AddCodeToDb1706063894993'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "db_credentials_mgr"."db" ADD "code" character varying NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "db_credentials_mgr"."db" ADD CONSTRAINT "UQ_491a6b566e3ef953d92a9c9c28e" UNIQUE ("code")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "db_credentials_mgr"."db" DROP CONSTRAINT "UQ_491a6b566e3ef953d92a9c9c28e"`)
    await queryRunner.query(`ALTER TABLE "db_credentials_mgr"."db" DROP COLUMN "code"`)
  }
}
