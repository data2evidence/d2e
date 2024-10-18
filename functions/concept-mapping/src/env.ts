import { object, z } from "zod";

const Env = z.object({
  NODE_ENV: z.string().optional(),
  CACHEDB__HOST: z.string(),
  CACHEDB__PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val)))
    .transform(Number),
});

let env = {};
const _env = Deno.env.toObject();
const result = Env.safeParse(_env);

if (result.success) {
  env = result.data;
} else {
  console.error(`Failed to load Envs! ${JSON.stringify(result)}`);
  throw new Error(`Failed to load Envs! ${JSON.stringify(result)}`);
}
export { env };
