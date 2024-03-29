import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddVocabSchema1706832297709 implements MigrationInterface {
  name = 'AddVocabSchema1706832297709'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "db_credentials_mgr"."db_vocab_schema" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "db_id" uuid NOT NULL,"created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(),  CONSTRAINT "UQ_7e81dd01682fcef28765fc9a325" UNIQUE ("db_id", "name"), CONSTRAINT "PK_aa47e89737a3bf8bbd1665e327a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "db_credentials_mgr"."db_vocab_schema" ADD CONSTRAINT "FK_1d308ce32d0a4b012b04977d832" FOREIGN KEY ("db_id") REFERENCES "db_credentials_mgr"."db"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "db_credentials_mgr"."db_vocab_schema" DROP CONSTRAINT "FK_1d308ce32d0a4b012b04977d832"`
    )
    await queryRunner.query(`DROP TABLE "db_credentials_mgr"."db_vocab_schema"`)
  }
}
