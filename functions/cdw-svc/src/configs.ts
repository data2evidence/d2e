import { z } from "zod";
import { EnvVarUtils, Logger } from "@alp/alp-base-utils";

const log = Logger.CreateLogger("cdw-svc: Loading of environment variables");

const Env = z
  .object({
    NODE_ENV: z.string(),
    ENV_MOUNT_PATH: z.string().optional(),
    PORT: z.string(),
    MRI_USER: z.string().optional(),
    USE_DUCKDB: z.string(),

    USE_CACHEDB: z.string(),
    CACHEDB__HOST: z.string(),
    CACHEDB__PORT: z
      .string()
      .refine((val) => !isNaN(parseInt(val)))
      .transform(Number),

    TLS__INTERNAL__KEY: z.string(),
    TLS__INTERNAL__CRT: z.string(),
    DUCKDB_PATH: z.string(),
    BUILT_IN_DUCKDB_PATH: z.string(),

    LOCAL_DEBUG: z.string(),
    isHttpTestRun: z.string().optional(),
    isTestEnv: z.string().optional(),
    TESTSCHEMA: z.string().optional(),

    PG__HOST: z.string(),
    PG__DB_NAME: z.string(),
    PG_USER: z.string(),
    PG_PASSWORD: z.string(),
    PG_SCHEMA: z.string(),
    PG__DIALECT: z.string(),
    PG__PORT: z
      .string()
      .refine((val) => !isNaN(parseInt(val)))
      .transform(Number),
    PG__MIN_POOL: z
      .string()
      .refine((val) => !isNaN(parseInt(val)))
      .transform(Number),
    PG__MAX_POOL: z
      .string()
      .refine((val) => !isNaN(parseInt(val)))
      .transform(Number),
    PG__IDLE_TIMEOUT_IN_MS: z
      .string()
      .refine((val) => !isNaN(parseInt(val)))
      .transform(Number),
  })
  .superRefine(
    (
      { LOCAL_DEBUG, isHttpTestRun, isTestEnv, TESTSCHEMA },
      refinementContext
    ) => {
      //Validate for non-prod scenarios
      if (LOCAL_DEBUG.toLowerCase() === "true") {
        const addError = (env) => {
          refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: `No value for ${env}`,
            path: [env],
          });
        };

        if (!isHttpTestRun) addError("isHttpTestRun");
        if (!isTestEnv) addError("isTestEnv");
        if (!TESTSCHEMA && isTestEnv && isTestEnv.toLowerCase() === "true")
          addError("TESTSCHEMA");
      }
    }
  );

let _env = Deno.env.toObject();
_env.PG_SCHEMA = _env.PG_SCHEMA || "cdw_config";

const result = Env.safeParse(_env);

let env = _env as unknown as z.infer<typeof Env>;
if (result.success) {
  env = result.data;
} else {
  console.error(`Service Failed to Start!! ${JSON.stringify(result)}`);
  throw new Error("Service Failed to Start!! Zod validation failed!");
}

const envVarUtils = new EnvVarUtils(_env);

export { env, envVarUtils };
