import { z } from "zod";
import { EnvVarUtils, Logger } from "@alp/alp-base-utils";

const log = Logger.CreateLogger("cdw-svc: Loading of environment variables");

const Env = z.object({
  NODE_ENV: z.string(),
  ENV_MOUNT_PATH: z.string().optional(),
  PORT: z.string(),
  MRI_USER: z.string().optional(),
  USE_DUCKDB: z.string(),
  TLS__INTERNAL__KEY: z.string(),
  TLS__INTERNAL__CRT: z.string(),
  DUCKDB_PATH: z.string(),
  
  PG__HOST: z.string(),
  PG__DB_NAME: z.string(),
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_SCHEMA: z.string(),
  PG__DIALECT: z.string(),
  PG__PORT: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .transform(Number),
  PG__MIN_POOL: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .transform(Number),
  PG__MAX_POOL: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .transform(Number),
  PG__IDLE_TIMEOUT_IN_MS: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .transform(Number),
});

let _env = Deno.env.toObject();
_env.PG_SCHEMA = _env.PG_SCHEMA || 'cdw_config';


const result = Env.safeParse(_env);

if (result.success === false) {
  log.warn(JSON.stringify(result));
}

const env = _env as unknown as z.infer<typeof Env>;
const envVarUtils = new EnvVarUtils(_env);

export { env, envVarUtils };
