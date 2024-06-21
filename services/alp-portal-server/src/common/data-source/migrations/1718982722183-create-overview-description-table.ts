import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateOverviewDescriptionTable1718982722183 implements MigrationInterface {
  name = 'CreateOverviewDescriptionTable1718982722183'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "portal"."overview_description" ( "id" character varying NOT NULL, "text" character varying NOT NULL, "created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_495a137f89d13174b8d6b9b8c13" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "portal"."overview_description"`)
  }
}
