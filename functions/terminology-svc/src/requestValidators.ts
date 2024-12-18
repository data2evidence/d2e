import { Request } from "express";
import { z } from "zod";
import { UserSchema } from "./validationSchemas.ts";

export const validator = <T extends z.ZodSchema>(
  req: Request,
  schema: T
): z.infer<T> => {
  try {
    return schema.parse(req);
  } catch (e) {
    throw e;
  }
};

export const getRoot = z.object({
  body: UserSchema,
});
