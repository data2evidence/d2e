import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserScopeToDbCredential1703139369074 implements MigrationInterface {
  name = 'AddUserScopeToDbCredential1703139369074'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "db_credentials_mgr"."db_credential" DROP CONSTRAINT "UQ_a1af6bcd4a24f65da83aef0b5d3"`
    )
    await queryRunner.query(
      `ALTER TABLE "db_credentials_mgr"."db_credential" ADD "user_scope" character varying NOT NULL DEFAULT 'Default'`
    )
    await queryRunner.query(
      `ALTER TABLE "db_credentials_mgr"."db_credential" ADD CONSTRAINT "UQ_862abd8f392d2ee0fef9c8a5009" UNIQUE ("db_id", "username", "user_scope")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "db_credentials_mgr"."db_credential" DROP CONSTRAINT "UQ_862abd8f392d2ee0fef9c8a5009"`
    )
    await queryRunner.query(`ALTER TABLE "db_credentials_mgr"."db_credential" DROP COLUMN "user_scope"`)
    await queryRunner.query(
      `ALTER TABLE "db_credentials_mgr"."db_credential" ADD CONSTRAINT "UQ_a1af6bcd4a24f65da83aef0b5d3" UNIQUE ("username", "db_id")`
    )
  }
}
