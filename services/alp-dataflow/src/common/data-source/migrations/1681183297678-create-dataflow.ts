import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateDataflow1681183297678 implements MigrationInterface {
  name = 'CreateDataflow1681183297678'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dataflow"."dataflow" ( "id" uuid NOT NULL, "name" character varying NOT NULL, "created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_35f3f05895b8686c1b2f2036e85" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "dataflow"."dataflow_revision" ("id" uuid NOT NULL, "flow" jsonb NOT NULL, "dataflow_id" uuid, "created_by" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_by" character varying NOT NULL, "modified_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7c1cf62c110430d1f38937f77fc" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_revision" ADD CONSTRAINT "FK_0bccdf321af54de19d6f22eebea" FOREIGN KEY ("dataflow_id") REFERENCES "dataflow"."dataflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dataflow"."dataflow_revision" DROP CONSTRAINT "FK_0bccdf321af54de19d6f22eebea"`
    )
    await queryRunner.query(`DROP TABLE "dataflow"."dataflow_revision"`)
    await queryRunner.query(`DROP TABLE "dataflow"."dataflow"`)
  }
}
