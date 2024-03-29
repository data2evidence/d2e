import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConceptSetTable1695345141909 implements MigrationInterface {
    name = 'CreateConceptSetTable1695345141909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "terminology"."concept_set" ("id" uuid NOT NULL, "name" character varying NOT NULL, "concepts" jsonb NOT NULL, "created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_aa6246f5d061e8b13084256fba4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "terminology"."concept_set"`);
    }

}
