import { z } from "zod";

const envSchema = z.object({
  CACHEDB__HOST: z.string(),
  CACHEDB__PORT: z.string().transform(Number),

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
