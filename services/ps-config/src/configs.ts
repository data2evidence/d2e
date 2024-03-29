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
        STAGE: z.string().optional()
    })

const result = Env.safeParse(process.env)

if (result.success === false) {
    log.warn(result.error);
}

const env = process.env as z.infer<typeof Env>;
const envVarUtils = new EnvVarUtils(process.env);

export {
    env, envVarUtils
}