import { Knex } from "knex";
import '../../env';

const rawUp = `CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}."MRIEntities_CollectionItems" (
    "Id" VARCHAR(100),
    "ItemType" VARCHAR(1024),
    "CollectionId" VARCHAR(32),
    "CreatedBy" VARCHAR(256),
    "CreatedAt" TIMESTAMP,
    "ChangedBy" VARCHAR(256),
    "ChangedAt" TIMESTAMP,
    "StatusId" VARCHAR(32)
);`

const rawDown = `DROP TABLE IF EXISTS ${process.env.PG_SCHEMA}."MRIEntities_CollectionItems";`

export async function up(knex: Knex): Promise<void> {
    return (knex.schema.withSchema(process.env.PG_SCHEMA).raw(rawUp))
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema(process.env.PG_SCHEMA).raw(rawDown)
}
