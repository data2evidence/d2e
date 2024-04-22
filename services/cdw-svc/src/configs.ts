import { z } from "zod";
import { EnvVarUtils, Logger } from "@alp/alp-base-utils";

const log = Logger.CreateLogger("cdw-svc: Loading of environment variables");

const Env = z.object({
  NODE_ENV: z.string(),
  ENV_MOUNT_PATH: z.string().optional(),
  PORT: z.string(),
  MRI_USER: z.string().optional(),
  DUCKDB__DATA_FOLDER: z.string(),
  USE_DUCKDB: z.string(),
  CONFIG_CONNECTION: z.string(),
  DUCKDB_DB_NAME:  z.string(),
  DUCKDB_SCHEMA:  z.string(),
  DUCKDB_VOCAB_SCHEMA:  z.string()
});

const result = Env.safeParse(process.env);

if (result.success === false) {
  log.warn(JSON.stringify(result));
}

const env = process.env as unknown as z.infer<typeof Env>;
const envVarUtils = new EnvVarUtils(process.env);

export { env, envVarUtils };
