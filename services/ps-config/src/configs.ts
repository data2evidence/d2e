import * as dotenv from "dotenv";
import { z } from "zod";
import { EnvVarUtils, Logger } from "@alp/alp-base-utils";
dotenv.config();

const log = Logger.CreateLogger("ps-config: Loading of environment variables");

const Env = z.object({
  NODE_ENV: z.string().optional(),
  ENV_MOUNT_PATH: z.string().optional(),
  PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val)))
    .transform(Number)
    .optional(),
  STAGE: z.string().optional(),
  TLS__INTERNAL__KEY: z.string(),
  TLS__INTERNAL__CRT: z.string(),
  PG__HOST: z.string(),
  PG__DB_NAME: z.string(),
  PG__DIALECT: z.string(),
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_SCHEMA: z.string(),
  PG__PORT: z
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
    .transform(Number)
});

const result = Env.safeParse(process.env);

if (result.success === false) {
  log.warn(result.error);
}

const env = process.env as z.infer<typeof Env>;
const envVarUtils = new EnvVarUtils(process.env);

export { env, envVarUtils };
