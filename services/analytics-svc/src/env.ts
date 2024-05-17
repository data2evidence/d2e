import * as dotenv from "dotenv";
import { object, z } from "zod";

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

    SKIP_AUTH: z.string(),
    LOCAL_DEBUG: z.string(),
    DEV_MODE: z.string(),
    isHttpTestRun: z.string(),
    isTestEnv: z.string(),
    local: z.string(),

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
});

const result = Env.safeParse(process.env);

let env = process.env as unknown as z.infer<typeof Env>;
if (result.success) {
    env = result.data;
} else {
    console.warn(JSON.stringify(result));
}

export { env };
