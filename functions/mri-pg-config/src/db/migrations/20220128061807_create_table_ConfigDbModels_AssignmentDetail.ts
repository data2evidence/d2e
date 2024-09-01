import { Knex } from "knex";
import '../../env';

const rawUp = `CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}."ConfigDbModels_AssignmentDetail" (
    "HeaderId" VARCHAR(40) NOT NULL,
    "ConfigId" VARCHAR(40) NOT NULL,
    "ConfigVersion" VARCHAR(20) NOT NULL,
    "ConfigType" VARCHAR(20) NOT NULL
);`

const rawDown = `DROP TABLE IF EXISTS ${process.env.PG_SCHEMA}."ConfigDbModels_AssignmentDetail";`

export async function up(knex: Knex): Promise<void> {
    return (knex.schema.withSchema(process.env.PG_SCHEMA).raw(rawUp))
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema(process.env.PG_SCHEMA).raw(rawDown)
}

