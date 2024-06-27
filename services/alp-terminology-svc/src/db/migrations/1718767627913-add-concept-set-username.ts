import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConceptSetUsername1718767627913 implements MigrationInterface {
  name = 'AddConceptSetUsername1718767627913';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "terminology"."concept_set" ADD "user_name" character varying NOT NULL DEFAULT 'admin'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "terminology"."concept_set" DROP COLUMN "user_name"`,
    );
  }
}
