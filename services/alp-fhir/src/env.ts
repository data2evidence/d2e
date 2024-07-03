import * as dotenv from 'dotenv'
import { z } from 'zod'

if (process.env.DOTENV_PATH) {
  dotenv.config({ path: process.env.DOTENV_PATH })
}

const Env = z.object({
  TLS__INTERNAL__KEY: z.string(),
  TLS__INTERNAL__CRT: z.string(),
  FHIR_CLIENT_ID: z.string(),
  FHIR_CLIENT_SECRET: z.string()
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
