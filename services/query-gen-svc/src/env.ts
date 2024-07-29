import * as dotenv from "dotenv";
import { object, z } from "zod";

const Env = z.object({
    SQL_RETURN_ON: z.string(),
    LOCAL_DEBUG: z.string(),
    NODE_ENV: z.string().optional(),
    PORT: z
        .string()
        .refine((val) => !isNaN(parseInt(val)))
        .transform(Number),
    isHttpTestRun: z.string().transform(Boolean),
    isTestEnv: z.string().transform(Boolean),
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
    TLS__INTERNAL__CA_CRT: z.string()
});

const result = Env.safeParse(process.env);

let env = process.env as unknown as z.infer<typeof Env>;
if (result.success) {
    env = result.data;
    console.log(env);
} else {
    // @ts-ignore
    console.warn(JSON.stringify(result.error));
}

export { env };
