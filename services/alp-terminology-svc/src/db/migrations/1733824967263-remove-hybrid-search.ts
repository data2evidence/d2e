import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveHybridSearch1733824967263 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS "terminology"."hybrid_search_config"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "terminology"."hybrid_search_config" ("id" SERIAL NOT NULL, "is_enabled" boolean NOT NULL, "semantic_ratio" real NOT NULL, "model" character varying NOT NULL, "created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_442afda502080d54e544aec329c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "terminology"."hybrid_search_config" ADD "source" character varying`,
    );
  }
}
