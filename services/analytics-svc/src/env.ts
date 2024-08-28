import * as dotenv from "dotenv";
import { object, z } from "zod";
import process from 'node:process';


if (process.env.DOTENV_PATH) {
    dotenv.config({ path: process.env.DOTENV_PATH });
}

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
    USE_CACHEDB: z.string(),

    CACHEDB__HOST: z.string(),
    CACHEDB__PORT: z
        .string()
        .refine((val) => !isNaN(parseInt(val)))
        .transform(Number),

    LOCAL_DEBUG: z.string(),
    SQL_RETURN_ON: z.string(),
    isHttpTestRun: z.string().optional(),
    isTestEnv: z.string().optional(),
    TESTSCHEMA: z.string().optional(),

    TLS__INTERNAL__KEY: z.string(),
    TLS__INTERNAL__CRT: z.string(),
    TLS__INTERNAL__CA_CRT: z.string(),

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
}).superRefine(({ LOCAL_DEBUG, isHttpTestRun, isTestEnv, TESTSCHEMA }, refinementContext) => {
    //Validate for non-prod scenarios
    if (LOCAL_DEBUG.toLowerCase() === "true") {
        const addError = (env) => {
            refinementContext.addIssue({
                code: z.ZodIssueCode.custom,
                message: `No value for ${env}`,
                path: [env],
              });
        }

        if (!isHttpTestRun) addError("isHttpTestRun")
        if (!isTestEnv) addError("isTestEnv")
        if (!TESTSCHEMA && (isTestEnv && isTestEnv.toLowerCase() === "true")) addError("TESTSCHEMA");
    }
});

const result = Env.safeParse(process.env);

let env: z.infer<typeof Env>;
if (result.success) {
    env = result.data;
} else {
    throw Error(`Service Failed to Start!! ${JSON.stringify(result)}`);
}

export { env };
