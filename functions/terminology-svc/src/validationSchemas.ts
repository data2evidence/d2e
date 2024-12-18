import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
extendZodWithOpenApi(z);

export const UserIdSchema = z.string().openapi({
  param: {
    name: "id",
    in: "path",
  },
  example: "1212121",
});

export const UserSchema = z
  .object({
    id: z.string().openapi({
      example: "1212121",
    }),
    name: z.string().openapi({
      example: "John Doe",
    }),
    age: z.number().openapi({
      example: 42,
    }),
  })
  .openapi("User");
