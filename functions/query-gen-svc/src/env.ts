import * as dotenv from "dotenv";
import { object, z } from "zod";

const Env = z.object({
    SQL_RETURN_ON: z.string(),
    LOCAL_DEBUG: z.string(),
    NODE_ENV: z.string().optional(),
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
    TLS__INTERNAL__CA_CRT: z.string(),
});

let _env = Deno.env.toObject() 


const result = Env.safeParse(_env);

let env = _env as unknown as z.infer<typeof Env>;
if (result.success) {
    env = result.data;
    // console.log(env);
} else {
    // @ts-ignore
    console.warn(JSON.stringify(result.error));
}

export { env };