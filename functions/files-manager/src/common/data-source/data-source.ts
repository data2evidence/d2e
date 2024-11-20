import { DataSource, DataSourceOptions, LogLevel } from "typeorm";
import { BlobData } from "../../files-manager/entity/blob-data.entity";
import { UserData } from "../../files-manager/entity/user-data.entity";

import { env } from "../../env";

export const getLogLevels = (): LogLevel[] => {
  if (env.NODE_ENV === "production") {
    return ["log", "info", "warn", "error", "migration"];
  }
  return ["log", "info", "warn", "error", "migration", "query", "schema"];
};

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: env.PG__HOST,
  port: env.PG__PORT,
  username: env.PG_ADMIN_USER,
  password: env.PG_ADMIN_PASSWORD,
  database: env.PG__DB_NAME,
  schema: env.PG_SCHEMA,
  logging: getLogLevels(),
  entities: [UserData, BlobData],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
