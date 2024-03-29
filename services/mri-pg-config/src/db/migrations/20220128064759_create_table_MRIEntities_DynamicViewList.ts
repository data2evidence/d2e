import { Knex } from "knex";
import '../../env';

const rawUp = `CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}."MRIEntities_DynamicViewList" (
    "ViewId" VARCHAR(1024) NOT NULL, 
    "CreatedBy" VARCHAR(256),
    "CreatedAt" TIMESTAMP,
    "Description" VARCHAR(1024),
    PRIMARY KEY ("ViewId")
);`

const rawDown = `DROP TABLE IF EXISTS ${process.env.PG_SCHEMA}."MRIEntities_DynamicViewList";`

export async function up(knex: Knex): Promise<void> {
    return (knex.schema.withSchema(process.env.PG_SCHEMA).raw(rawUp))
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema(process.env.PG_SCHEMA).raw(rawDown)
}
