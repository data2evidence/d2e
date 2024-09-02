import * as dotenv from 'dotenv'
import { z } from 'zod'

if (Deno.env.has("DOTENV_PATH")) {
  dotenv.config({ path: Deno.env.get("DOTENV_PATH") })
}

const Env = z.object({
  PG__HOST: z.string(),
  PG__DB_NAME: z.string(),
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_SCHEMA: z.string(),
  PG__DIALECT: z.string(),
  NODE_ENV: z.string().optional(),
  PG_CA_ROOT_CERT: z.string().optional(),
  PG_ADMIN_USER: z.string().optional(),
  PG_ADMIN_PASSWORD: z.string().optional(),

  PG__PORT: z
    .string()
    .refine(val => !isNaN(parseInt(val)))
    .transform(Number),
  PG__MIN_POOL: z
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
    .transform(Number),

  PG__DEBUG: z.string().transform(val => val === '1' || /true/i.test(val)),
  sqlOnly: z.string().transform(val => val === '1' || /true/i.test(val)),

  PG_SSL: z
    .string()
    .transform(val => val === '1' || /true/i.test(val))
    .optional(),

  TLS__INTERNAL__KEY: z.string(),
  TLS__INTERNAL__CRT: z.string(),
})

let _env = Deno.env.toObject() 
_env.PG_SCHEMA =  _env.PG_SCHEMA || 'qe_config'


const result = Env.safeParse(_env)

let env = _env as unknown as z.infer<typeof Env>
if (result.success) {
  env = result.data
} else {
  // @ts-ignore
  console.warn(JSON.stringify(result.error))
}

export { env }