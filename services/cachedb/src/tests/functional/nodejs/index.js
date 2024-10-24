const { strict } = require("node:assert");
const pg = require("pg");

async function test_duckdb() {
  pool = new pg.Pool({
    host: "localhost",
    port: 41191,
    max: 1,
    user: "REPLACE_WITH_BEARER_TOKEN",
    database: "B|duckdb|write|alpdev_pg|cdmdefault|cdmvocab",
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  const client = await pool.connect();
  stmt = "select * from cdmdefault.person where person_id = ($1)";
  result = await client.query(stmt, [1]);
  strict.equal(result.rows[0].person_id, 1);
}

async function test_postgres() {
  pool = new pg.Pool({
    host: "localhost",
    port: 41191,
    max: 1,
    user: "REPLACE_WITH_BEARER_TOKEN",
    database: "B|postgresql|read|alpdev_pg|cdmdefault",
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  const client = await pool.connect();

  stmt = "select * from cdmdefault.person where person_id = ($1)";
  result = await client.query(stmt, [1]);
  strict.equal(result.rows[0].person_id, 1);
}

async function test() {
  console.log("Running cachedb nodejs test");
  await test_duckdb();
  await test_postgres();
  console.log("Tests successful");
  process.exit();
}

test();
