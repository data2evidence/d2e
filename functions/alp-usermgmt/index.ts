//import {start} from "./src/main.ts"
import  knex from 'knex'
import config from "./src/db/knexfile-admin.ts";
import { MigrationSource } from "./src/db/MigrationSource.ts"
import { SeedSource } from "./src/db/SeedSource.ts"


const k = knex(config);
try {
    console.log(">>> migration: start <<<");
    const m = await k.migrate.latest({migrationSource: new MigrationSource()});
    console.log(">>> seed: start <<<");
    const s = await k.seed.run({seedSource: new SeedSource()});
    console.log(">>> migration/seed: done <<<");
    (await import("./src/main.ts")).start();
} catch(e) {
    console.error(e);
}
