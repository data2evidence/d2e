// @ts-types="npm:@types/express"
import express, { NextFunction, Response, Request } from "express";
import { z } from "zod";
import { env } from "./env.ts";
import { getRoot, validator } from "./requestValidators.ts";

const main = () => {
  const app = express();
  app.use(express.json());

  // TODO: split into router
  app.get("/terminology/concept-set", (req, res, next) => {
    try {
      // const { body } = validator(req, getRoot);
      res.send("Welcome to the Concept Set API!");
    } catch (e) {
      next(e);
    }
  });

  app.use((e: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (e instanceof z.ZodError) {
      res.status(400).json(e.issues);
      return;
    }
    console.error(e.stack); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  });

  const port = 3000;

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

export { main };
// TODO: try using the zod to openapi with express, then make it a function, then add the terminology apis to the function
