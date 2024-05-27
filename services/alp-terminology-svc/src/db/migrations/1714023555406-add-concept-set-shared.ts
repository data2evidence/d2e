import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConceptSetShared1714023555406 implements MigrationInterface {
  name = 'AddConceptSetShared1714023555406';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "terminology"."concept_set" ADD "shared" boolean DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "terminology"."concept_set" DROP COLUMN "shared"`,
    );
  }
}
