import { object, z } from 'zod'

const Env = z.object({
  FHIR__CLIENT_ID: z.string(),
  FHIR__CLIENT_SECRET: z.string(),
  FHIR__LOG_LEVEL: z.string(),
  PORT: z.string(),
  SERVICE_ROUTES: z
  .string()
  .transform((str: any, ctx: any): z.infer<ReturnType<typeof object>> => {
      try {
          return JSON.parse(str);
      } catch (e) {
          ctx.addIssue({ code: "custom", message: "Invalid JSON" });
          return z.never();
      }
  }),
  FHIR_SCHEMA_PATH: z.string(),
  FHIR_SCHEMA_FILE_NAME: z.string(),
  DUCKDB_PATH: z.string(),
  TLS__INTERNAL__CA_CRT: z.string().optional(),
  IDP__ALP_DATA_CLIENT_ID: z.string(),
  IDP__ALP_DATA__CLIENT_SECRET: z.string(),
  ALP_GATEWAY_OAUTH__URL: z.string(),
  CACHEDB__HOST: z.string(),
  CACHEDB__PORT: z.string()
})
const _env = Deno.env.toObject()
const result = Env.safeParse(_env)
_env.GATEWAY_CA_CERT = _env.TLS__INTERNAL__CA_CRT?.replace(/\\n/g, '\n')

let env = _env as unknown as z.infer<typeof Env>
if (result.success) {
  env = result.data;
} else {
  console.error(`Service Failed to Start!! ${JSON.stringify(result)}`);
  throw new Error(`Service Failed to Start!! ${JSON.stringify(result)}`);
}
export { env }