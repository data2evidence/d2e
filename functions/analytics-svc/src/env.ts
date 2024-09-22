import * as dotenv from "dotenv";
import { object, z } from "zod";

let env = {}; 

function initEnv(__env) {
    const _env = Object.assign({}, Deno.env.toObject(), __env)
    const Env = z.object({
        ALP_GATEWAY_OAUTH__URL: z.string(),
        ALP__SYSTEM_ID: z.string(),
        ANALYTICS_SVC__DEFAULT_ASSIGNMENT_NAME: z.string(),
        ANALYTICS_SVC__PORT: z
            .string()
            .refine((val) => !isNaN(parseInt(val)))
            .transform(Number),
        ANALYTICS_SVC__STUDIES_METADATA__TTL_IN_SECONDS: z
            .string()
            .refine((val) => !isNaN(parseInt(val)))
            .transform(Number),
        DUCKDB__DATA_FOLDER: z.string(),
        IDP__ALP_SVC__CLIENT_ID: z.string(),
        IDP__ALP_SVC__CLIENT_SECRET: z.string(),
        USE_EXTENSION_FOR_COHORT_CREATION: z.string(),

        USE_DUCKDB: z.string(),
        USE_SQL_PROXY: z.string(),

        SQL_PROXY__HOST: z.string(),
        SQL_PROXY__PORT: z
            .string()
            .refine((val) => !isNaN(parseInt(val)))
            .transform(Number),

        SKIP_AUTH: z.string(),
        LOCAL_DEBUG: z.string(),
        SQL_RETURN_ON: z.string(),
        isHttpTestRun: z.string(),
        isTestEnv: z.string(),
        local: z.string(),

        TLS__INTERNAL__KEY: z.string().optional(),
        TLS__INTERNAL__CRT: z.string().optional(),
        TLS__INTERNAL__CA_CRT: z.string().optional(),
        NODE_ENV: z.string().optional(),
        ENV_MOUNT_PATH: z.string().optional(),
        TESTSCHEMA: z.string().optional(),
        //DATABASE_CREDENTIALS: z.array().optional(),
        MINIO__ENDPOINT: z.string().optional(),
        MINIO__PORT: z
        .string()
        .refine((val) => !isNaN(parseInt(val)))
        .transform(Number),
        MINIO__SSL: z.string(),
        MINIO__ACCESS_KEY: z.string(),
        MINIO__SECRET_KEY: z.string(),
        MINIO__REGION: z.string(),
        DB_SVC__LOG_LEVEL: z.string().optional(),
        INTEGRATION_TEST__HANA__TENANT_CONFIGS: z.string().optional(),
        PG__READ_ROLE: z.string().optional(),
       // PG__TENANT_CONFIGS: z.string().optional(),
        HANA__READ_ROLE: z.string().optional(),
        //HANA__TENANT_CONFIGS: z.string().optional(),
        DB_SVC__IDP_SUBJECT_PROP: z.string().optional(),
        DB_SVC__PATH: z.string().optional(),
        DB_SVC__PORT: z.string().optional(),
        IS_AUDIT_LOG_ENABLED: z.string().optional(),
        SERVICE_ROUTES: z
            .string()
            .transform((str, ctx): z.infer<ReturnType<typeof object>> => {
                try {
                    return JSON.parse(str);
                } catch (e) {
                    ctx.addIssue({ code: "custom", message: "Invalid JSON" });
                    return z.never();
                }
            }),
    });

    const result =  Env.safeParse(_env);
    env = _env as unknown as z.infer<typeof Env>;
    if (result.success) {
        env = result.data;
        env['DATABASE_CREDENTIALS'] = _env['DATABASE_CREDENTIALS'];
        env['PG__TENANT_CONFIGS'] = _env['PG__TENANT_CONFIGS'];
        env['HANA__TENANT_CONFIGS'] = _env['HANA__TENANT_CONFIGS'];
        env['VCAP_SERVICES'] = _env['VCAP_SERVICES'];

    } else {
        console.error(JSON.stringify(result));
        throw new Error("ZOD parse failed")
    }
    return env;
    
}


export { env, initEnv };
