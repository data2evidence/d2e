import { object, z } from 'zod'
import * as dotenv from 'dotenv'
dotenv.config({path: '/Users/afreen.sikandara/Documents/data4life-fork/dev-afreen-d2e/services/alp-fhir-svc/src/env.ts'})

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
  GATEWAY_CA_CERT: z.string(),
  IDP__ALP_SVC__CLIENT_ID: z.string(),
  IDP__ALP_SVC__CLIENT_SECRET: z.string(),
  ALP_GATEWAY_OAUTH__URL: z.string(),
  CACHEDB__HOST: z.string(),
  CACHEDB__PORT: z.string()
})

const result = Env.safeParse(process.env)

let env: z.infer<typeof Env>;
if (result.success) {
  env = result.data;
} else {
  console.error(`Service Failed to Start!! ${JSON.stringify(result)}`);
  process.exit(1);
}
export { env }