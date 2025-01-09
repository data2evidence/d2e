import { getCodeSuggestion } from "./services";
import express, { Request, Response } from "express";

export class CodeSuggestionRouter {
  public router = express.Router();

  constructor() {
    this.registerRoutes();
  }

  private registerRoutes () {
    this.router.post(
      "/",
      async (req: Request, res: Response) => {
        const suggestion = await getCodeSuggestion(req.body);
        res.send(suggestion)
      }
    )
  }
}