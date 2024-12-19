import { z } from "zod";

const envSchema = z.object({
  // TERMINOLOGY_SVC__LOG_LEVEL: z.string(),
  // TERMINOLOGY_SVC__PATH: z.string(),
  // NODE_ENV: z.string(),
  // LOCAL_DEBUG: z.string(),

  // PG__HOST: z.string(),
  // PG__PORT: z.string().transform(Number),
  // PG_MANAGE_USER: z.string(),
  // PG_MANAGE_PASSWORD: z.string(),
  // PG_USER: z.string(),
  // PG_PASSWORD: z.string(),
  // PG__DB_NAME: z.string(),
  // PG_SCHEMA: z.string(),
  // PG__MAX_POOL: z.string().transform(Number),
  // PG_CA_ROOT_CERT: z.string().optional(),
  // CLI_MIGRATION: z.string().optional(),

  // TERMINOLOGY_SVC__PORT: z
  //   .string()
  //   .refine((val) => !isNaN(parseInt(val)))
  //   .transform(Number),

  // TLS__INTERNAL__KEY: z.string(),
  // TLS__INTERNAL__CRT: z.string(),
  // TLS__INTERNAL__CA_CRT: z.string(),

  // CACHEDB__HOST: z.string(),
  // CACHEDB__PORT: z.string().transform(Number),

  SERVICE_ROUTES: z
    .string()
    .transform((str, ctx): { [key: string]: string } => {
      try {
        return JSON.parse(str);
      } catch (e) {
        ctx.addIssue({ code: "custom", message: "Invalid JSON" });
        throw e;
      }
    }),
});

const { success, data, error } = envSchema.safeParse(Deno.env.toObject());

if (!success) {
  console.error(error);
  Deno.exit(1);
}

const env = data;

export { env };
