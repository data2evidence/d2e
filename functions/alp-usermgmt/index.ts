import {start} from "./src/main.ts"
import  knex from 'knex'
import config from "./src/db/knexfile-admin.ts";
import { MigrationSource } from "./src/db/MigrationSource.ts"
import { SeedSource } from "./src/db/SeedSource.ts"


const k = knex(config);
const m = await k.migrate.latest({migrationSource: new MigrationSource()});
const s = await k.seed.run({seedSource: new SeedSource()});
console.log("migration: done")

start()