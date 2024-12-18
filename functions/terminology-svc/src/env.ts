import { z } from "zod";

const envSchema = z.object({
  //   JEROME: z.string(),
  //   PORT: z
  //     .string()
  //     .refine((val) => !isNaN(parseInt(val)))
  //     .transform(Number),
});

const { success, data, error } = envSchema.safeParse(Deno.env.toObject());

if (!success) {
  console.error(error);
  Deno.exit(1);
}

const env = data;

export { env };
