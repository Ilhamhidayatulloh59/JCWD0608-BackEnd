import axios from "axios";
import { Request, Response, Router } from "express";

export class PokemonRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", async (req: Request, res: Response) => {
      const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon");

      res.status(200).send(data.results);
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
