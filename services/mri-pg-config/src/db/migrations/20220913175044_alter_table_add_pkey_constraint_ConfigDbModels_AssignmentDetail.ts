import { Knex } from "knex";
import '../../env';

const rawUp = `ALTER TABLE ${process.env.PG_SCHEMA}."ConfigDbModels_AssignmentDetail" ADD CONSTRAINT "ConfigDbModels_AssignmentDetail_pkey" PRIMARY KEY ("HeaderId", "ConfigId");`

const rawDown = `ALTER TABLE ${process.env.PG_SCHEMA}."ConfigDbModels_AssignmentDetail" DROP CONSTRAINT "ConfigDbModels_AssignmentDetail_pkey";`

export async function up(knex: Knex): Promise<void> {
    return (knex.schema.withSchema(process.env.PG_SCHEMA).raw(rawUp))
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema(process.env.PG_SCHEMA).raw(rawDown)
}