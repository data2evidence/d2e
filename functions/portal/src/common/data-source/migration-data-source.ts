import { join } from "node:path";
import { DataSource, DataSourceOptions } from "typeorm";
import { env } from "../../env.ts";
// import { getSsl, getLogLevels } from './data-source'
const _env = Deno.env.toObject();

const baseDir = _env.CLI_MIGRATION === "true" ? "src" : "dist";

const migrationDataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: env.PG_HOST,
  port: env.PG_PORT,
  username: env.PG_MANAGE_USER,
  password: env.PG_MANAGE_PASSWORD,
  database: env.PG_DATABASE,
  schema: env.PG_SCHEMA,
  poolSize: env.PG_MAX_POOL,
  entities: [join(baseDir, "**/*.entity.{ts,js}")],
  migrations: [join(baseDir, "**/common/data-source/migrations/*.{ts,js}")],
};

const migrationDataSource = new DataSource(migrationDataSourceOptions);
export default migrationDataSource;
