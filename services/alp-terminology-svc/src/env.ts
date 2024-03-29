import { z } from 'zod';

const Env = z.object({
  TERMINOLOGY_SVC__LOG_LEVEL: z.string(),
  TERMINOLOGY_SVC__PATH: z.string(),
  FHIR_TERMINOLOGY_SVC__PORT: z.string(),
  NODE_ENV: z.string(),
  LOCAL_DEBUG: z.string(),
  SYSTEM_PORTAL__API_URL: z.string(),
  AI__API_URL: z.string(),
  MEILISEARCH__API_URL: z.string(),
  MEILI_MASTER_KEY: z.string(),

  PG_HOST: z.string(),
  PG_PORT: z.string().transform(Number),
  PG_MANAGE_USER: z.string(),
  PG_MANAGE_PASSWORD: z.string(),
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_DATABASE: z.string(),
  PG_SCHEMA: z.string(),
  PG_MAX_POOL: z.string().transform(Number),
  PG_CA_ROOT_CERT: z.string().optional(),
  CLI_MIGRATION: z.string().optional(),

  TERMINOLOGY_SVC__PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val)))
    .transform(Number),
});

const result = Env.safeParse(process.env);

let env = process.env as unknown as z.infer<typeof Env>;
if (result.success) {
  env = result.data;
} else {
  console.warn(JSON.stringify(result));
}

export { env };
