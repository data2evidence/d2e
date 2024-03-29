import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHybridSearchTable1710956517262 implements MigrationInterface {
    name = 'CreateHybridSearchTable1710956517262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "terminology"."hybrid-search-config"; CREATE TABLE "terminology"."hybrid_search_config" ("id" SERIAL NOT NULL, "is_enabled" boolean NOT NULL, "semantic_ratio" real NOT NULL, "model" character varying NOT NULL, "created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_442afda502080d54e544aec329c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "terminology"."hybrid_search_config"`);
    }

}