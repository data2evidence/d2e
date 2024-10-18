import express, { Request, Response } from "npm:express";

const app = express();

export class ConceptMappingRouter {
  public router = express.Router();
  private readonly logger = console;

  constructor() {
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get("/", async (req: Request, res: Response) => {
      this.logger.log("concept mapping route triggered");
      res.status(200).send("success");
    });
  }
}

app.use(express.json());
app.use("/concept-mapping", new ConceptMappingRouter().router);
app.listen(8000);
