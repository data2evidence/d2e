import  knex from 'knex'
import config from "./src/db/knexfile-admin.ts";
import pg from 'pg';

const k = knex(config);
const m = await k.migrate.latest();
const s = await k.seed.run();
console.log("mri-pg-config: done")
