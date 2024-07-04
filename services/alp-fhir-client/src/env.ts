// import * as dotenv from 'dotenv'
import { object, z } from 'zod'
// dotenv.config()
// // if (process.env.DOTENV_PATH) {
// //   dotenv.config({ path: process.env.DOTENV_PATH })
// // }

const Env = z.object({
  TLS__INTERNAL__KEY: z.string(),
  TLS__INTERNAL__CRT: z.string(),
  FHIR_CLIENT_ID: z.string(),
  FHIR_CLIENT_SECRET: z.string(),
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
