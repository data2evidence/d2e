import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateDbCredential1700709870313 implements MigrationInterface {
  name = 'CreateDbCredential1700709870313'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "db_credentials_mgr"."db_credential" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, "service_scope" character varying NOT NULL, "db_id" uuid NOT NULL, "created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a1af6bcd4a24f65da83aef0b5d3" UNIQUE ("db_id", "username"), CONSTRAINT "PK_630b747927278b5971968875050" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "db_credentials_mgr"."db" ("id" uuid NOT NULL, "host" character varying NOT NULL, "port" integer NOT NULL, "name" character varying NOT NULL, "schema" character varying NOT NULL, "dialect" character varying NOT NULL, "extra" character varying, "created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ef0ad4a88bc632fd4d6a0b09ddf" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "db_credentials_mgr"."db_credential" ADD CONSTRAINT "FK_e8bf4dec1b74e8f3097888c4bcc" FOREIGN KEY ("db_id") REFERENCES "db_credentials_mgr"."db"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "db_credentials_mgr"."db_credential" DROP CONSTRAINT "FK_e8bf4dec1b74e8f3097888c4bcc"`
    )
    await queryRunner.query(`DROP TABLE "db_credentials_mgr"."db"`)
    await queryRunner.query(`DROP TABLE "db_credentials_mgr"."db_credential"`)
  }
}
