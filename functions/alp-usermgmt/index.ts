import {start} from "./src/main.ts"
import  knex from 'knex'
import config from "./src/db/knexfile-admin.ts";

const k = knex(config);
//const m = await k.migrate.latest();
//const s = await k.seed.run();
console.log("migration: done")

start()