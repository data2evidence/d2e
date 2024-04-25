import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConceptSetUser1714022585960 implements MigrationInterface {
    name = 'AddConceptSetUser1714022585960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "terminology"."concept_set" ADD "user_id" character varying`);
        await queryRunner.query(`ALTER TABLE "terminology"."concept_set" ADD "shared" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "terminology"."concept_set" DROP COLUMN "shared"`);
        await queryRunner.query(`ALTER TABLE "terminology"."concept_set" DROP COLUMN "user_id"`);
    }

}
