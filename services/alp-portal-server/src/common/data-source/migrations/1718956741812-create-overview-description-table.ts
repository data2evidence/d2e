import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateOverviewDescriptionTable1718956741812 implements MigrationInterface {
  name = 'CreateOverviewDescriptionTable1718956741812'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "portal"."overview_description" ("created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL, "text" character varying NOT NULL, CONSTRAINT "PK_495a137f89d13174b8d6b9b8c13" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "portal"."overview_description"`)
  }
}
