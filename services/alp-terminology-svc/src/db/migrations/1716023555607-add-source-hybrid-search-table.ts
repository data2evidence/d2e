import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConceptSetShared1714023555406 implements MigrationInterface {
  name = 'AddSourceHybridSearch1716023555607';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "terminology"."hybrid_search_config" ADD "source" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "terminology"."hybrid_search_config" DROP COLUMN "source"`,
    );
  }
}
