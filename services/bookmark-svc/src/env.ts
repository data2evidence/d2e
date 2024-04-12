import * as dotenv from 'dotenv'
import { z } from 'zod'

if (process.env.DOTENV_PATH) {
  dotenv.config({ path: process.env.DOTENV_PATH })
}

const Env = z.object({
  PG_HOST: z.string(),
  PG_DB_NAME: z.string(),
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_SCHEMA: z.string(),

  NODE_ENV: z.string().optional(),
  PG_CA_ROOT_CERT: z.string().optional(),
  PG_ADMIN_USER: z.string().optional(),
  PG_ADMIN_PASSWORD: z.string().optional(),

  PG_PORT: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .transform(Number),
  PG_MIN_POOL: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .transform(Number),
  PG_MAX_POOL: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .transform(Number),
  PG_IDLE_TIMEOUT_IN_MS: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .transform(Number),

  PG_DEBUG: z.string().transform(val => val === '1' || /true/i.test(val)),
  sqlOnly: z.string().transform(val => val === '1' || /true/i.test(val)),

  PG_SSL: z
    .string()
    .transform(val => val === '1' || /true/i.test(val))
    .optional(),

  TLS__INTERNAL__KEY: z.string(),
  TLS__INTERNAL__CRT: z.string(),
})

const result = Env.safeParse(process.env)

let env = process.env as unknown as z.infer<typeof Env>
if (result.success) {
  env = result.data
} else {
  // @ts-ignore
  console.warn(JSON.stringify(result.error))
}

export { env }
