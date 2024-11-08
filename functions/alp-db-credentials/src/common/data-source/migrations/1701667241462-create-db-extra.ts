import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateDbExtra1701667241462 implements MigrationInterface {
  name = 'CreateDbExtra1701667241462'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "db_credentials_mgr"."db_extra" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, "service_scope" character varying NOT NULL, "db_id" uuid NOT NULL, "created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2c00d40454a74a07284f53c3e40" UNIQUE ("service_scope", "db_id"), CONSTRAINT "PK_692b25da07a6fce963c98a1c444" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "db_credentials_mgr"."db" DROP COLUMN "schema"`)
    await queryRunner.query(`ALTER TABLE "db_credentials_mgr"."db" DROP COLUMN "extra"`)
    await queryRunner.query(
      `ALTER TABLE "db_credentials_mgr"."db_extra" ADD CONSTRAINT "FK_90722678a5543b197d244e87faa" FOREIGN KEY ("db_id") REFERENCES "db_credentials_mgr"."db"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "db_credentials_mgr"."db_extra" DROP CONSTRAINT "FK_90722678a5543b197d244e87faa"`
    )
    await queryRunner.query(`ALTER TABLE "db_credentials_mgr"."db" ADD "extra" character varying`)
    await queryRunner.query(`ALTER TABLE "db_credentials_mgr"."db" ADD "schema" character varying NOT NULL`)
    await queryRunner.query(`DROP TABLE "db_credentials_mgr"."db_extra"`)
  }
}
