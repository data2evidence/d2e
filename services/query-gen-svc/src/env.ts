import * as dotenv from "dotenv";
import { object, z } from "zod";

const Env = z
    .object({
        SQL_RETURN_ON: z.string(),
        LOCAL_DEBUG: z.string(),
        NODE_ENV: z.string().optional(),
        PORT: z
            .string()
            .refine((val) => !isNaN(parseInt(val)))
            .transform(Number),
        isHttpTestRun: z.string().transform(Boolean).optional(),
        isTestEnv: z.string().transform(Boolean).optional(),
        TESTSCHEMA: z.string().optional(),
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
        TLS__INTERNAL__CA_CRT: z.string(),
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
                if (!TESTSCHEMA && (isTestEnv && isTestEnv === true)) addError("TESTSCHEMA");

            }
        }
    );

const result = Env.safeParse(process.env);

let env: z.infer<typeof Env>;
if (result.success) {
    env = result.data;
    // console.log(env);
} else {
    throw Error(`Service Failed to Start!! ${JSON.stringify(result)}`);
}

export { env };
