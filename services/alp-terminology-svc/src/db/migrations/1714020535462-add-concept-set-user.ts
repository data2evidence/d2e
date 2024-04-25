import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConceptSetUser1714020535462 implements MigrationInterface {
    name = 'AddConceptSetUser1714020535462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "terminology"."concept_set" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "terminology"."concept_set" ADD "shared" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "terminology"."concept_set" DROP COLUMN "shared"`);
        await queryRunner.query(`ALTER TABLE "terminology"."concept_set" DROP COLUMN "user_id"`);
    }

}
