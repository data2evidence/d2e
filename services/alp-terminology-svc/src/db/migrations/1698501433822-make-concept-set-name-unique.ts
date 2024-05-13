import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeConceptSetNameUnique1698501433822
  implements MigrationInterface
{
  name = 'MakeConceptSetNameUnique1698501433822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "terminology"."concept_set" ADD CONSTRAINT "UQ_20739b8961e6be570aa68e4bf6d" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "terminology"."concept_set" DROP CONSTRAINT "UQ_20739b8961e6be570aa68e4bf6d"`,
    );
  }
}
